// =============================================================================
// GET /.netlify/functions/enrollment-status?id=<uuid>   (public, safe by obscurity)
// Returns minimal fields so the /enrollment-success page can poll until the
// webhook updates the row to status='paid'. UUIDs are 128-bit and are only
// handed to the owning user via the Razorpay Checkout success handler.
// =============================================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.URL || 'https://hopetrustindia.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: 'Server misconfiguration' }, 500);
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id || !UUID_REGEX.test(id)) {
    return json({ error: 'Invalid id' }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from('enrollments')
    .select('id, status, program_title, program_level, amount_inr, razorpay_payment_id, razorpay_order_id, paid_at')
    .eq('id', id)
    .single();

  if (error || !data) return json({ error: 'Not found' }, 404);

  // Return only non-sensitive fields
  return json({
    id: data.id,
    status: data.status,
    program_title: data.program_title,
    program_level: data.program_level,
    amount_inr: data.amount_inr,
    payment_id: data.razorpay_payment_id,
    order_id: data.razorpay_order_id,
    paid_at: data.paid_at,
  });
};
