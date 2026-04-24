// =============================================================================
// Client-side enrollment + Razorpay helpers
// Used by EnrollmentModal + /enrollment-success
// =============================================================================

export type ProgramType = 'training' | 'addiction';

export interface CreateOrderInput {
  program_type: ProgramType;
  program_id: string;
  level_index?: number;
  full_name: string;
  email: string;
  phone: string;
}

export interface CreateOrderResponse {
  enrollment_id: string;
  order_id: string;
  amount: number;        // paise
  currency: 'INR';
  key_id: string;
  program_title: string;
  program_level: string | null;
  prefill: { name: string; email: string; contact: string };
}

export interface EnrollmentStatus {
  id: string;
  status: 'created' | 'paid' | 'failed' | 'abandoned';
  program_title: string;
  program_level: string | null;
  amount_inr: number;
  paid_at: string | null;
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (body?.error) return String(body.error);
  } catch {
    /* ignore */
  }
  return `${fallback} (HTTP ${res.status})`;
}

/** Create a Razorpay order + enrollment row (public). */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResponse> {
  const res = await fetch('/.netlify/functions/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseError(res, 'Unable to start payment'));
  }
  return res.json();
}

/** Poll enrollment status (public, safe by UUID obscurity). */
export async function fetchEnrollmentStatus(id: string): Promise<EnrollmentStatus> {
  const res = await fetch(`/.netlify/functions/enrollment-status?id=${encodeURIComponent(id)}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(await parseError(res, 'Unable to fetch enrollment'));
  return res.json();
}

/** Format paise as Indian Rupees display string. */
export function formatINR(paise: number): string {
  const rupees = (paise || 0) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

// ── Razorpay Checkout script loader (idempotent) ─────────────────────────────
let razorpayPromise: Promise<void> | null = null;

export function loadRazorpayCheckout(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Not in browser'));
  if ((window as unknown as { Razorpay?: unknown }).Razorpay) return Promise.resolve();
  if (razorpayPromise) return razorpayPromise;

  razorpayPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Razorpay script failed to load')));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.dataset.razorpayCheckout = 'true';
    s.onload = () => resolve();
    s.onerror = () => {
      razorpayPromise = null;
      reject(new Error('Razorpay script failed to load'));
    };
    document.head.appendChild(s);
  });
  return razorpayPromise;
}

// Minimal Razorpay Checkout types (subset we use)
interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void; escape?: boolean };
}

interface RazorpayInstance {
  open(): void;
  on(event: string, cb: (payload: unknown) => void): void;
}

export async function openRazorpayCheckout(
  opts: RazorpayOptions
): Promise<void> {
  await loadRazorpayCheckout();
  const Razorpay = (window as unknown as { Razorpay: new (o: RazorpayOptions) => RazorpayInstance }).Razorpay;
  const rzp = new Razorpay(opts);
  rzp.open();
}
