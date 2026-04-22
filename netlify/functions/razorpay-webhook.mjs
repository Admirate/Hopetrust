// =============================================================================
// POST /.netlify/functions/razorpay-webhook   (public; signature-verified)
// Razorpay calls this endpoint for payment.captured / payment.failed events.
// Docs: https://razorpay.com/docs/webhooks/
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from './_shared/razorpay.mjs';
import {
  buildEnrollmentConfirmationEmail,
  buildAdminAlertEmail,
  sendEmail,
} from './_shared/emails.mjs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Razorpay origin — unrestricted is fine since we verify signature
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function text(body, status = 200) {
  return new Response(body, { status, headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' } });
}

/** Fire-and-forget audit log (never throws). */
async function writeAudit(supabase, { action, actorEmail = null, resourceId = null, metadata = {} }) {
  try {
    await supabase.from('admin_audit_log').insert({
      action,
      actor_email: actorEmail,
      resource_type: 'enrollment',
      resource_id: resourceId,
      metadata,
    });
  } catch (err) {
    console.error('[webhook audit]', err);
  }
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') return text('Method not allowed', 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return text('Server misconfiguration', 500);
  }

  // ── Read raw body (required for signature verification) ───────────────────
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn('[webhook] Invalid signature');
    return text('Invalid signature', 400);
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return text('Invalid JSON', 400);
  }

  const eventType = event?.event;
  const payment = event?.payload?.payment?.entity;
  if (!payment) {
    // Unrelated event (e.g. order.paid) — acknowledge and skip
    return text('ignored', 200);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // ── Locate enrollment by razorpay_order_id ────────────────────────────────
  const orderId = payment.order_id;
  if (!orderId) return text('missing order_id', 400);

  const { data: enrollment, error: fetchErr } = await supabase
    .from('enrollments')
    .select('*')
    .eq('razorpay_order_id', orderId)
    .single();

  if (fetchErr || !enrollment) {
    console.warn('[webhook] Enrollment not found for order', orderId);
    // Still return 200 so Razorpay doesn't retry forever; log for manual reconciliation
    return text('enrollment not found', 200);
  }

  // ── Idempotency: if already paid with the same payment_id, just ack ───────
  if (enrollment.status === 'paid' && enrollment.razorpay_payment_id === payment.id) {
    return text('already processed', 200);
  }

  // ── Handle payment.captured ───────────────────────────────────────────────
  if (eventType === 'payment.captured' || payment.status === 'captured') {
    const nowIso = new Date().toISOString();

    const { error: updateErr } = await supabase
      .from('enrollments')
      .update({
        status: 'paid',
        razorpay_payment_id: payment.id,
        paid_at: nowIso,
        metadata: {
          ...(enrollment.metadata || {}),
          webhook_event: eventType,
          razorpay_method: payment.method,
          razorpay_captured_at: payment.captured_at,
        },
      })
      .eq('id', enrollment.id);

    if (updateErr) {
      console.error('[webhook] DB update failed:', updateErr);
      return text('db error', 500);
    }

    await writeAudit(supabase, {
      action: 'ENROLLMENT_PAID',
      resourceId: enrollment.id,
      metadata: {
        program_type: enrollment.program_type,
        program_title: enrollment.program_title,
        amount_inr: enrollment.amount_inr,
        payment_id: payment.id,
      },
    });

    // ── Send emails in parallel (never block response if one fails) ─────────
    const userEmailPayload = buildEnrollmentConfirmationEmail({
      fullName: enrollment.full_name,
      programTitle: enrollment.program_title,
      programLevel: enrollment.program_level,
      amountInr: enrollment.amount_inr,
      paymentId: payment.id,
      orderId,
      enrollmentId: enrollment.id,
    });

    const adminEmailPayload = buildAdminAlertEmail({
      fullName: enrollment.full_name,
      email: enrollment.email,
      phone: enrollment.phone,
      programType: enrollment.program_type,
      programTitle: enrollment.program_title,
      programLevel: enrollment.program_level,
      amountInr: enrollment.amount_inr,
      paymentId: payment.id,
      orderId,
      enrollmentId: enrollment.id,
      createdAt: enrollment.created_at,
    });

    const adminTo = process.env.ADMIN_ALERT_EMAIL
      || process.env.NEWSLETTER_FROM_EMAIL
      || 'frontoffice@hopetrustindia.com';

    const [userRes, adminRes] = await Promise.all([
      sendEmail({
        to: enrollment.email,
        ...userEmailPayload,
      }),
      sendEmail({
        to: adminTo,
        ...adminEmailPayload,
      }),
    ]);

    if (!userRes.ok || !adminRes.ok) {
      // Persist send results for debugging but still return 200
      await supabase
        .from('enrollments')
        .update({
          metadata: {
            ...(enrollment.metadata || {}),
            email_user: userRes,
            email_admin: adminRes,
          },
        })
        .eq('id', enrollment.id);
    }

    return text('ok', 200);
  }

  // ── Handle payment.failed ─────────────────────────────────────────────────
  if (eventType === 'payment.failed' || payment.status === 'failed') {
    await supabase
      .from('enrollments')
      .update({
        status: 'failed',
        razorpay_payment_id: payment.id,
        failure_reason: payment.error_description || payment.error_reason || 'Payment failed',
        metadata: {
          ...(enrollment.metadata || {}),
          webhook_event: eventType,
          error_code: payment.error_code,
          error_source: payment.error_source,
          error_step: payment.error_step,
        },
      })
      .eq('id', enrollment.id);

    await writeAudit(supabase, {
      action: 'ENROLLMENT_FAILED',
      resourceId: enrollment.id,
      metadata: {
        payment_id: payment.id,
        error_code: payment.error_code,
        error_description: payment.error_description,
      },
    });

    return text('ok', 200);
  }

  // Other events (authorized, refunded, etc.) — ignore for now
  return text('ignored', 200);
};
