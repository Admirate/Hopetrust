// =============================================================================
// /.netlify/functions/admin-enrollments   (JWT-gated)
//
// GET  /?status=&program_type=&program_id=&from=&to=&q=&limit=&offset=
//      Returns { enrollments, total }
// GET  /?format=csv  (same filters)
//      Returns text/csv download
// PATCH /?id=<uuid>
//      Body: { status?, notes? }  — limited admin corrections
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.URL || 'https://hopetrustindia.com',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
};

const VALID_STATUSES = new Set(['created', 'paid', 'failed', 'abandoned']);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function verifyToken(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !JWT_SECRET) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

async function writeAudit(supabase, req, { action, actorEmail, resourceId = null, metadata = {} }) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-nf-client-connection-ip')
            || null;
    await supabase.from('admin_audit_log').insert({
      action,
      actor_email: actorEmail ?? null,
      resource_type: 'enrollment',
      resource_id: resourceId,
      metadata,
      ip_address: ip,
    });
  } catch (err) {
    console.error('[audit]', err);
  }
}

/** CSV-safe escape: wrap in quotes, double-up embedded quotes, keep unicode as-is. */
function csvCell(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows) {
  const headers = [
    'id', 'created_at', 'status', 'program_type', 'program_title', 'program_level',
    'amount_inr', 'full_name', 'email', 'phone',
    'razorpay_order_id', 'razorpay_payment_id', 'paid_at', 'failure_reason',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(headers.map((h) => csvCell(r[h])).join(','));
  }
  return lines.join('\n');
}

/** Build Supabase query with filters from URL params. */
function applyFilters(query, params) {
  const status = params.get('status');
  if (status && VALID_STATUSES.has(status)) query = query.eq('status', status);

  const programType = params.get('program_type');
  if (programType === 'training' || programType === 'addiction') {
    query = query.eq('program_type', programType);
  }

  const programId = params.get('program_id');
  if (programId && UUID_REGEX.test(programId)) query = query.eq('program_id', programId);

  const from = params.get('from');
  if (from && !Number.isNaN(Date.parse(from))) query = query.gte('created_at', new Date(from).toISOString());

  const to = params.get('to');
  if (to && !Number.isNaN(Date.parse(to))) query = query.lte('created_at', new Date(to).toISOString());

  const q = (params.get('q') || '').trim();
  if (q && q.length <= 100) {
    // Search across name/email/phone/payment_id — escape % and _ for ILIKE safety
    const safe = q.replace(/[%_]/g, (c) => `\\${c}`);
    query = query.or(
      `full_name.ilike.%${safe}%,email.ilike.%${safe}%,phone.ilike.%${safe}%,razorpay_payment_id.ilike.%${safe}%,razorpay_order_id.ilike.%${safe}%`
    );
  }

  return query;
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !JWT_SECRET) {
    return json({ error: 'Server misconfiguration' }, 500);
  }

  const user = verifyToken(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const url = new URL(req.url);
  const params = url.searchParams;

  // ── GET: list or CSV export ──────────────────────────────────────────────
  if (req.method === 'GET') {
    const wantCsv = params.get('format') === 'csv';

    if (wantCsv) {
      let q = supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10000); // hard safety cap for exports
      q = applyFilters(q, params);

      const { data, error } = await q;
      if (error) return json({ error: error.message }, 500);

      const csv = toCsv(data || []);
      const filename = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
      return new Response(csv, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    const limit = Math.min(parseInt(params.get('limit') || '', 10) || DEFAULT_LIMIT, MAX_LIMIT);
    const offset = Math.max(parseInt(params.get('offset') || '', 10) || 0, 0);

    let query = supabase
      .from('enrollments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    query = applyFilters(query, params);

    const { data, error, count } = await query;
    if (error) return json({ error: error.message }, 500);

    return json({ enrollments: data || [], total: count ?? 0, limit, offset });
  }

  // ── PATCH: limited admin correction ──────────────────────────────────────
  if (req.method === 'PATCH') {
    const id = params.get('id');
    if (!id || !UUID_REGEX.test(id)) return json({ error: 'Valid id is required' }, 400);

    let body;
    try { body = await req.json(); } catch { return json({ error: 'Invalid JSON body' }, 400); }

    const patch = {};
    if (body?.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) return json({ error: 'Invalid status' }, 400);
      patch.status = body.status;
    }
    if (body?.notes !== undefined) {
      if (typeof body.notes !== 'string' || body.notes.length > 2000) {
        return json({ error: 'Notes must be a string up to 2000 chars' }, 400);
      }
      // Merge into metadata.admin_notes (non-destructive)
      const { data: current } = await supabase
        .from('enrollments')
        .select('metadata')
        .eq('id', id)
        .single();
      patch.metadata = { ...(current?.metadata || {}), admin_notes: body.notes };
    }
    if (Object.keys(patch).length === 0) {
      return json({ error: 'No supported fields provided' }, 400);
    }

    const { data, error } = await supabase
      .from('enrollments')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) return json({ error: error.message }, 500);

    await writeAudit(supabase, req, {
      action: 'ENROLLMENT_UPDATED',
      actorEmail: user.email,
      resourceId: id,
      metadata: { fields: Object.keys(patch) },
    });

    return json({ enrollment: data });
  }

  return json({ error: 'Method not allowed' }, 405);
};
