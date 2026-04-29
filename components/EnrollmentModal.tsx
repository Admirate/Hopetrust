'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import {
  createOrder,
  openRazorpayCheckout,
  type ProgramType,
} from '@/lib/enrollment';

export interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  programType: ProgramType;
  programId: string;
  programTitle: string;
  /** For multi-level training programs; index into the levels[] array. Omit for single-price programs. */
  levelIndex?: number;
  /** Short line shown under the program title, e.g. 'Level 1 — 10 hours — INR 2,500'. */
  levelLabel?: string;
  /** Human-readable price (for display only; authoritative amount is resolved server-side). */
  priceDisplay?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

/**
 * Minimal enrollment flow: collects name/email/phone, creates Razorpay order,
 * opens Razorpay Checkout. On handler success, redirects to /enrollment-success
 * where the page polls the webhook status.
 */
export default function EnrollmentModal({
  open,
  onClose,
  programType,
  programId,
  programTitle,
  levelIndex,
  levelLabel,
  priceDisplay,
}: EnrollmentModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Reset state whenever the modal opens
  useEffect(() => {
    if (open) {
      setError(null);
      setSubmitting(false);
      // Focus first input shortly after the open animation starts
      const t = setTimeout(() => firstInputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, submitting, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const name = fullName.trim();
    const em = email.trim();
    const ph = phone.trim();

    if (name.length < 2) return setError('Please enter your full name.');
    if (!EMAIL_REGEX.test(em)) return setError('Please enter a valid email address.');
    if (!PHONE_REGEX.test(ph)) return setError('Please enter a valid phone number.');

    setSubmitting(true);
    try {
      const order = await createOrder({
        program_type: programType,
        program_id: programId,
        level_index: typeof levelIndex === 'number' ? levelIndex : undefined,
        full_name: name,
        email: em,
        phone: ph,
      });

      await openRazorpayCheckout({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'AREL Hope Recovery Services Hyderabad',
        description: order.program_level
          ? `${order.program_title} — ${order.program_level}`
          : order.program_title,
        order_id: order.order_id,
        prefill: order.prefill,
        notes: { enrollment_id: order.enrollment_id },
        theme: { color: '#00373E' },
        handler: () => {
          // Razorpay has captured; webhook will finalise. Navigate to success page.
          const params = new URLSearchParams({ id: order.enrollment_id });
          window.location.href = `/enrollment-success/?${params.toString()}`;
        },
        modal: {
          ondismiss: () => {
            // User closed the Razorpay overlay — stay on this modal so they can retry.
            setSubmitting(false);
          },
          escape: true,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !submitting) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enrollment-modal-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative w-full max-w-[520px] overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* Header */}
            <div className="bg-[#00373E] px-6 pb-5 pt-6 text-white sm:px-8">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#ED7428]">
                Enroll now
              </p>
              <h2 id="enrollment-modal-title" className="mt-1 text-xl font-semibold leading-tight sm:text-2xl">
                {programTitle}
              </h2>
              {levelLabel && (
                <p className="mt-1 text-sm text-white/80">{levelLabel}</p>
              )}
              {priceDisplay && (
                <p className="mt-3 inline-block rounded-full bg-[#ED7428]/20 px-3 py-1 text-sm font-semibold text-[#FFD7B8]">
                  {priceDisplay}
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-7">
              <p className="mb-5 text-sm text-[#486364]">
                Enter your details to proceed to secure payment via Razorpay.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="enroll-name" className="mb-1 block text-xs font-semibold text-[#00373E]">
                    Full name
                  </label>
                  <input
                    ref={firstInputRef}
                    id="enroll-name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={200}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-xl border border-[#D8D5CE] bg-white px-4 py-3 text-[15px] text-[#00373E] outline-none transition focus:border-[#00373E] focus:ring-2 focus:ring-[#00373E]/10 disabled:opacity-60"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="enroll-email" className="mb-1 block text-xs font-semibold text-[#00373E]">
                    Email
                  </label>
                  <input
                    id="enroll-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    maxLength={200}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-xl border border-[#D8D5CE] bg-white px-4 py-3 text-[15px] text-[#00373E] outline-none transition focus:border-[#00373E] focus:ring-2 focus:ring-[#00373E]/10 disabled:opacity-60"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="enroll-phone" className="mb-1 block text-xs font-semibold text-[#00373E]">
                    Phone
                  </label>
                  <input
                    id="enroll-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    maxLength={20}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-xl border border-[#D8D5CE] bg-white px-4 py-3 text-[15px] text-[#00373E] outline-none transition focus:border-[#00373E] focus:ring-2 focus:ring-[#00373E]/10 disabled:opacity-60"
                    placeholder="+91 90008 50001"
                  />
                </div>
              </div>

              {error && (
                <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-full bg-[#ED7428] px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#d4651f] focus:outline-none focus:ring-4 focus:ring-[#ED7428]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Preparing secure payment…' : 'Proceed to payment'}
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-[#6A8181]">
                Payments are processed securely by Razorpay. By continuing you agree to be contacted
                by AREL Hope Recovery Services Hyderabad regarding your enrollment.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
