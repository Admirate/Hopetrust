// =============================================================================
// Razorpay REST API helpers (no SDK — pure fetch + Node crypto)
// Shared by create-order.mjs and razorpay-webhook.mjs
// =============================================================================

import crypto from 'node:crypto';

const RAZORPAY_API = 'https://api.razorpay.com/v1';

/**
 * Create a Razorpay order via REST API.
 * Docs: https://razorpay.com/docs/api/orders/
 *
 * @param {object} opts
 * @param {number} opts.amount   Amount in paise (INR * 100)
 * @param {string} opts.receipt  Unique receipt id (we use enrollment UUID)
 * @param {object} [opts.notes]  Optional key/value metadata stored on the order
 * @returns {Promise<{id: string, amount: number, currency: string, status: string}>}
 */
export async function createRazorpayOrder({ amount, receipt, notes = {} }) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const res = await fetch(`${RAZORPAY_API}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount,
      currency: 'INR',
      receipt,
      notes,
      payment_capture: 1, // auto-capture
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.description || `Razorpay order creation failed (${res.status})`;
    const err = new Error(msg);
    err.razorpay = data;
    throw err;
  }
  return data;
}

/**
 * Verify Razorpay webhook signature.
 * Docs: https://razorpay.com/docs/webhooks/validate-test/
 *
 * @param {string} rawBody        Exact raw request body string
 * @param {string} signature      X-Razorpay-Signature header value
 * @param {string} [webhookSecret] Defaults to env var
 * @returns {boolean}
 */
export function verifyWebhookSignature(rawBody, signature, webhookSecret) {
  const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature || !rawBody) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  // Constant-time comparison
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Verify a Razorpay Checkout success handler signature (client-side callback).
 * Formula: HMAC_SHA256(order_id + "|" + payment_id, key_secret) === signature
 *
 * @param {object} p
 * @param {string} p.orderId
 * @param {string} p.paymentId
 * @param {string} p.signature
 * @returns {boolean}
 */
export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || !orderId || !paymentId || !signature) return false;

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
