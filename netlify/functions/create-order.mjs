// =============================================================================
// POST /.netlify/functions/create-order   (public, rate-limited)
// Creates a Razorpay order + an `enrollments` row in 'created' status.
// Returns payload needed to open Razorpay Checkout on the client.
// =============================================================================

import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { createRazorpayOrder } from './_shared/razorpay.mjs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.URL || 'https://hopetrustindia.com',
  'Access-Control-Allow-Headers': 'Content-Type, Idempotency-Key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ── Input caps ───────────────────────────────────────────────────────────────
const LIMITS = {
  name: 200,
  email: 200,
  phone: 20,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── Abuse prevention ─────────────────────────────────────────────────────────
const MAX_BODY_BYTES = 4096;               // 4 KB — payload has ~6 small fields
const RATE_WINDOW_MS = 15 * 60 * 1000;     // 15-minute sliding window
const MAX_ORDERS_PER_IP = 10;              // per IP in the window
const MAX_ORDERS_PER_EMAIL = 5;            // per email in the window
const DUPLICATE_WINDOW_MS = 30 * 60 * 1000; // reuse existing 'created' order within 30 min

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/**
 * Resolve authoritative amount (paise) + display label from the correct program table.
 * NEVER trust a client-supplied amount — always pulled from DB here.
 */
async function resolveProgram(supabase, { program_type, program_id, level_index }) {
  if (program_type === 'addiction') {
    const { data, error } = await supabase
      .from('addiction_programs')
      .select('id, title, cost_inr, is_active')
      .eq('id', program_id)
      .single();
    if (error || !data) return { error: 'Program not found' };
    if (!data.is_active) return { error: 'Program is not currently available' };
    if (!data.cost_inr || data.cost_inr <= 0) return { error: 'Program pricing not configured' };
    return {
      amount_inr: data.cost_inr,
      program_title: data.title,
      program_level: null,
    };
  }

  if (program_type === 'training') {
    const { data, error } = await supabase
      .from('training_programs')
      .select('id, title, fee_inr, levels, is_active')
      .eq('id', program_id)
      .single();
    if (error || !data) return { error: 'Program not found' };
    if (!data.is_active) return { error: 'Program is not currently available' };

    const levels = Array.isArray(data.levels) ? data.levels : [];

    // Multi-level program — client must pick a level
    if (levels.length > 0) {
      const idx = Number.isInteger(level_index) ? level_index : -1;
      const level = levels[idx];
      if (!level) return { error: 'Please select a valid program level' };
      const priceInr = Number(level.price_inr);
      if (!priceInr || priceInr <= 0) return { error: 'Level pricing not configured' };
      const levelLabel = [level.label, level.hours].filter(Boolean).join(' — ');
      return {
        amount_inr: priceInr,
        program_title: data.title,
        program_level: levelLabel || level.label || null,
      };
    }

    // Single-fee program (e.g. traineeship)
    if (!data.fee_inr || data.fee_inr <= 0) return { error: 'Program pricing not configured' };
    return {
      amount_inr: data.fee_inr,
      program_title: data.title,
      program_level: null,
    };
  }

  return { error: 'Invalid program type' };
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RAZORPAY_KEY_ID) {
    return json({ error: 'Server misconfiguration' }, 500);
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return json({ error: 'Content-Type must be application/json' }, 415);
  }

  // ── Request size limit ──────────────────────────────────────────────────────
  const declaredLength = parseInt(req.headers.get('content-length') || '0', 10);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: 'Request body too large' }, 413);
  }

  let rawBody;
  try {
    rawBody = await req.text();
  } catch {
    return json({ error: 'Failed to read request body' }, 400);
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return json({ error: 'Request body too large' }, 413);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // ── Validate input ─────────────────────────────────────────────────────────
  const {
    program_type,
    program_id,
    level_index,
    full_name,
    email,
    phone,
  } = body || {};

  if (program_type !== 'training' && program_type !== 'addiction') {
    return json({ error: 'Invalid program_type' }, 400);
  }
  if (typeof program_id !== 'string' || !UUID_REGEX.test(program_id)) {
    return json({ error: 'Invalid program_id' }, 400);
  }
  if (typeof full_name !== 'string' || full_name.trim().length < 2 || full_name.length > LIMITS.name) {
    return json({ error: 'Please provide your full name' }, 400);
  }
  if (typeof email !== 'string' || email.length > LIMITS.email || !EMAIL_REGEX.test(email.trim())) {
    return json({ error: 'Please provide a valid email address' }, 400);
  }
  if (typeof phone !== 'string' || phone.length > LIMITS.phone || !PHONE_REGEX.test(phone.trim())) {
    return json({ error: 'Please provide a valid phone number' }, 400);
  }

  // ── Extract request metadata early (needed for rate limiting + storage) ───
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          || req.headers.get('x-nf-client-connection-ip')
          || null;
  const userAgent = req.headers.get('user-agent') || null;
  const idempotencyKey = req.headers.get('idempotency-key') || null;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // ── Idempotency: if client resends with the same key, return cached result ─
  if (idempotencyKey) {
    const { data: cached } = await supabase
      .from('enrollments')
      .select('id, razorpay_order_id, amount_inr, program_title, program_level, full_name, email, phone')
      .filter('metadata->>idempotency_key', 'eq', idempotencyKey)
      .maybeSingle();
    if (cached) {
      return json({
        enrollment_id: cached.id,
        order_id: cached.razorpay_order_id,
        amount: cached.amount_inr,
        currency: 'INR',
        key_id: RAZORPAY_KEY_ID,
        program_title: cached.program_title,
        program_level: cached.program_level,
        prefill: { name: cached.full_name, email: cached.email, contact: cached.phone },
      });
    }
  }

  const rateCutoff = new Date(Date.now() - RATE_WINDOW_MS).toISOString();

  // ── IP-based rate limit ───────────────────────────────────────────────────
  if (ip) {
    const { count, error: rlErr } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', rateCutoff)
      .filter('metadata->>ip', 'eq', ip);
    if (!rlErr && count !== null && count >= MAX_ORDERS_PER_IP) {
      return json({ error: 'Too many requests. Please try again later.' }, 429);
    }
  }

  // ── Email-based rate limit ────────────────────────────────────────────────
  {
    const { count, error: rlErr } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', rateCutoff)
      .eq('email', email.trim().toLowerCase());
    if (!rlErr && count !== null && count >= MAX_ORDERS_PER_EMAIL) {
      return json({ error: 'Too many orders for this email. Please try again later.' }, 429);
    }
  }

  // ── Duplicate order guard ─────────────────────────────────────────────────
  // If the same email already has a 'created' order for the same program
  // within the duplicate window, return the existing order instead of
  // creating a new one. This prevents orphaned Razorpay orders.
  {
    const dupCutoff = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
    const { data: dup } = await supabase
      .from('enrollments')
      .select('id, razorpay_order_id, amount_inr, program_title, program_level, full_name, email, phone')
      .eq('email', email.trim().toLowerCase())
      .eq('program_id', program_id)
      .eq('status', 'created')
      .gte('created_at', dupCutoff)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (dup) {
      return json({
        enrollment_id: dup.id,
        order_id: dup.razorpay_order_id,
        amount: dup.amount_inr,
        currency: 'INR',
        key_id: RAZORPAY_KEY_ID,
        program_title: dup.program_title,
        program_level: dup.program_level,
        prefill: { name: dup.full_name, email: dup.email, contact: dup.phone },
        _reused: true,
      });
    }
  }

  // ── Resolve authoritative amount from DB ──────────────────────────────────
  const resolved = await resolveProgram(supabase, {
    program_type,
    program_id,
    level_index: Number.isInteger(level_index) ? level_index : undefined,
  });
  if (resolved.error) return json({ error: resolved.error }, 400);

  const { amount_inr, program_title, program_level } = resolved;

  // ── Create Razorpay order ─────────────────────────────────────────────────
  // We need an enrollment UUID ahead of time to use as the receipt (so the
  // webhook can look up the row by razorpay_order_id later). Generate with
  // crypto.randomUUID() — supabase will use it as the enrollment PK.
  const enrollmentId = crypto.randomUUID();

  let rpOrder;
  try {
    rpOrder = await createRazorpayOrder({
      amount: amount_inr,
      receipt: enrollmentId, // max 40 chars; UUIDs are 36 — fits
      notes: {
        enrollment_id: enrollmentId,
        program_type,
        program_id,
        email: email.trim(),
        ip: ip || 'unknown',
      },
    });
  } catch (err) {
    console.error('[create-order] Razorpay error:', err);
    return json({ error: 'Unable to initiate payment. Please try again.' }, 502);
  }

  // ── Insert enrollment row (status=created) ────────────────────────────────
  const { error: insertError } = await supabase.from('enrollments').insert({
    id: enrollmentId,
    program_type,
    program_id,
    program_title,
    program_level,
    amount_inr,
    full_name: full_name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    razorpay_order_id: rpOrder.id,
    status: 'created',
    metadata: {
      ip,
      user_agent: userAgent,
      ...(idempotencyKey ? { idempotency_key: idempotencyKey } : {}),
    },
  });

  if (insertError) {
    console.error('[create-order] DB insert failed:', insertError);
    // Order exists at Razorpay but our DB record failed — return error; a manual
    // reconciliation via webhook `order.paid` notes.enrollment_id can still
    // surface the payment later.
    return json({ error: 'Unable to record enrollment. Please try again.' }, 500);
  }

  // ── Return checkout payload ───────────────────────────────────────────────
  return json({
    enrollment_id: enrollmentId,
    order_id: rpOrder.id,
    amount: rpOrder.amount,
    currency: rpOrder.currency,
    key_id: RAZORPAY_KEY_ID,
    program_title,
    program_level,
    prefill: {
      name: full_name.trim(),
      email: email.trim(),
      contact: phone.trim(),
    },
  });
};
