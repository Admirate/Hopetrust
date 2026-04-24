'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import {
  fetchEnrollmentStatus,
  formatINR,
  type EnrollmentStatus,
} from '@/lib/enrollment';
import { siteConfig } from '@/lib/config';

const Footer = dynamic(() => import('@/components/Footer'));

// Polling config: ~30s total at 2s intervals
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 15;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function EnrollmentSuccessPage() {
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [status, setStatus] = useState<EnrollmentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read ?id=<uuid> once on mount (client-only; static export compatible)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id || !UUID_REGEX.test(id)) {
      setError('Missing or invalid enrollment reference.');
      return;
    }
    setEnrollmentId(id);
  }, []);

  // Poll enrollment status until paid (or attempts exhausted)
  useEffect(() => {
    if (!enrollmentId) return;

    let cancelled = false;

    async function tick(attempt: number) {
      try {
        const data = await fetchEnrollmentStatus(enrollmentId!);
        if (cancelled) return;
        setStatus(data);
        setAttempts(attempt);

        if (data.status === 'paid' || data.status === 'failed') return;
        if (attempt >= MAX_POLL_ATTEMPTS) return;

        pollTimer.current = setTimeout(() => tick(attempt + 1), POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to fetch enrollment status');
      }
    }

    tick(1);

    return () => {
      cancelled = true;
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [enrollmentId]);

  const isPaid = status?.status === 'paid';
  const isFailed = status?.status === 'failed';
  const isProcessing = !isPaid && !isFailed && !error;
  const pollExhausted = attempts >= MAX_POLL_ATTEMPTS && isProcessing;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F5EF] pb-24 pt-28 sm:pt-32">
        <section className="mx-auto w-full max-w-[680px] px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
          >
            {/* Header block */}
            <div className="bg-[#00373E] px-6 py-10 text-center text-white sm:px-10 sm:py-12">
              {isPaid ? (
                <CheckCircle2 className="mx-auto h-14 w-14 text-[#ED7428]" strokeWidth={1.5} />
              ) : isFailed ? (
                <AlertTriangle className="mx-auto h-14 w-14 text-red-300" strokeWidth={1.5} />
              ) : (
                <Loader2 className="mx-auto h-14 w-14 animate-spin text-[#ED7428]" strokeWidth={1.5} />
              )}
              <h1 className="mt-5 text-2xl font-semibold sm:text-3xl">
                {isPaid
                  ? 'Enrollment confirmed'
                  : isFailed
                  ? 'Payment could not be completed'
                  : pollExhausted
                  ? 'Still processing…'
                  : 'Confirming your payment…'}
              </h1>
              <p className="mx-auto mt-3 max-w-[480px] text-sm text-white/80 sm:text-base">
                {isPaid
                  ? 'Thank you. A confirmation email is on its way to your inbox.'
                  : isFailed
                  ? status?.status === 'failed'
                    ? 'Your payment did not go through. You can close this page and try again from the program card.'
                    : 'Please contact us if the amount was debited.'
                  : pollExhausted
                  ? "We haven't received final confirmation yet. If you completed payment, it will reflect within a few minutes. You can safely close this page."
                  : 'Please keep this page open for a few seconds while we verify your payment.'}
              </p>
            </div>

            {/* Details */}
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              {error && (
                <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {status && (
                <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:text-[15px]">
                  <Row label="Program" value={status.program_title} />
                  {status.program_level && <Row label="Level" value={status.program_level} />}
                  <Row label="Amount" value={formatINR(status.amount_inr)} />
                  <Row label="Status" value={<StatusPill status={status.status} />} />
                  <Row label="Reference" value={<Mono>{status.id}</Mono>} full />
                </dl>
              )}

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-[#00373E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#024a53]"
                >
                  Back to home
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center justify-center rounded-full border border-[#00373E] px-6 py-3 text-sm font-semibold text-[#00373E] transition hover:bg-[#00373E] hover:text-white"
                >
                  Contact us
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, full = false }: { label: string; value: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6A8181]">
        {label}
      </dt>
      <dd className="mt-1 break-all text-[#00373E]">{value}</dd>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[13px] text-[#374151]">{children}</span>
  );
}

function StatusPill({ status }: { status: EnrollmentStatus['status'] }) {
  const config = {
    paid: { label: 'Paid', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    created: { label: 'Awaiting confirmation', bg: 'bg-amber-100', text: 'text-amber-800' },
    failed: { label: 'Failed', bg: 'bg-red-100', text: 'text-red-800' },
    abandoned: { label: 'Abandoned', bg: 'bg-gray-100', text: 'text-gray-700' },
  }[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
