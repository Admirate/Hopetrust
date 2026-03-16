'use client';

import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[\d\s+\-()]+$/, 'Please enter a valid phone number'),
});

type FormData = z.infer<typeof schema>;

interface NewsletterFormProps {
  variant?: 'inline' | 'card';
  className?: string;
  dark?: boolean;
}

export default function NewsletterForm({
  variant = 'card',
  className = '',
  dark = false,
}: NewsletterFormProps) {
  const [form, setForm] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([result.data]);

      if (error) {
        if (error.code === '23505') {
          toast.error('You\'re already subscribed!');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
        return;
      }

      setSuccess(true);
      setForm({ full_name: '', email: '', phone: '' });
      toast.success('Welcome aboard! You\'re now subscribed to our newsletter.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <CheckCircle2
          className={`h-5 w-5 flex-shrink-0 ${dark ? 'text-emerald-400' : 'text-emerald-500'}`}
        />
        <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-[#00373E]'}`}>
          You&apos;re subscribed! Check your inbox soon.
        </p>
      </div>
    );
  }

  const inputBase = `w-full rounded-full text-sm outline-none transition-all placeholder:text-gray-400 ${
    dark
      ? 'bg-white/10 text-white border border-white/20 placeholder:text-white/40 focus:border-[#ED7428] focus:ring-1 focus:ring-[#ED7428]'
      : 'bg-white text-gray-800 border border-gray-200 focus:border-[#ED7428] focus:ring-1 focus:ring-[#ED7428]'
  }`;

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`w-full ${className}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className={`${inputBase} px-4 py-2.5`}
            />
            {errors.full_name && (
              <p className="mt-1 ml-3 text-[10px] text-red-400">{errors.full_name}</p>
            )}
          </div>
          <div className="flex-1">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`${inputBase} px-4 py-2.5`}
            />
            {errors.email && (
              <p className="mt-1 ml-3 text-[10px] text-red-400">{errors.email}</p>
            )}
          </div>
          <div className="flex-1">
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`${inputBase} px-4 py-2.5`}
            />
            {errors.phone && (
              <p className="mt-1 ml-3 text-[10px] text-red-400">{errors.phone}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex-shrink-0 rounded-full bg-[#ED7428] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#d4631f] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full space-y-3 ${className}`}>
      <div>
        <input
          type="text"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          className={`${inputBase} px-5 py-3`}
        />
        {errors.full_name && (
          <p className="mt-1 ml-4 text-[11px] text-red-400">{errors.full_name}</p>
        )}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`${inputBase} px-5 py-3`}
        />
        {errors.email && (
          <p className="mt-1 ml-4 text-[11px] text-red-400">{errors.email}</p>
        )}
      </div>
      <div>
        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`${inputBase} px-5 py-3`}
        />
        {errors.phone && (
          <p className="mt-1 ml-4 text-[11px] text-red-400">{errors.phone}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#ED7428] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#d4631f] disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : (
          'Subscribe to Newsletter'
        )}
      </button>
    </form>
  );
}
