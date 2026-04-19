import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.URL || 'https://hopetrustindia.com',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// ── Field length limits (must match client-side constants in app/admin/page.tsx) ──
const LIMITS = {
  title: 200,
  subtitle: 200,
  description: 2000,
  note: 500,
  cost: 100,
  feature_item: 300,
  features_count: 20,
};

/** Returns an error string if any field exceeds its limit, otherwise null. */
function validateFields({ title, subtitle, description, features, note, cost }) {
  if (title        && title.length        > LIMITS.title)         return `Title must be ${LIMITS.title} characters or fewer`;
  if (subtitle     && subtitle.length     > LIMITS.subtitle)      return `Subtitle must be ${LIMITS.subtitle} characters or fewer`;
  if (description  && description.length  > LIMITS.description)   return `Description must be ${LIMITS.description} characters or fewer`;
  if (cost         && cost.length         > LIMITS.cost)          return `Cost must be ${LIMITS.cost} characters or fewer`;
  if (note         && note.length         > LIMITS.note)          return `Note must be ${LIMITS.note} characters or fewer`;
  if (Array.isArray(features)) {
    if (features.length > LIMITS.features_count)
      return `Maximum ${LIMITS.features_count} features allowed`;
    for (const f of features)
      if (typeof f === 'string' && f.length > LIMITS.feature_item)
        return `Each feature must be ${LIMITS.feature_item} characters or fewer`;
  }
  return null;
}

/** Fire-and-forget audit log write. Never throws — never blocks the response. */
async function writeAuditLog(supabase, req, { action, actorEmail, resourceId = null, metadata = {} }) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-nf-client-connection-ip')
            || null;
    await supabase.from('admin_audit_log').insert({
      action,
      actor_email: actorEmail ?? null,
      resource_type: 'program',
      resource_id: resourceId,
      metadata,
      ip_address: ip,
    });
  } catch (err) {
    console.error('[audit]', err);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

/** Verify JWT from Authorization header. Returns decoded payload or null. */
function verifyToken(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export default async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !JWT_SECRET) {
    return jsonResponse({ error: 'Server misconfiguration' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // ── GET: public list of active programs (no auth required) ──
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('addiction_programs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ programs: data });
  }

  // ── All other methods require admin auth ──
  const user = verifyToken(req);
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  // ── POST: create a new program ──
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { title, subtitle, description, features, note, cost, display_order } = body;

      if (!title || !cost) {
        return jsonResponse({ error: 'Title and cost are required' }, 400);
      }

      const fieldError = validateFields({ title, subtitle, description, features, note, cost });
      if (fieldError) return jsonResponse({ error: fieldError }, 400);

      const { data, error } = await supabase
        .from('addiction_programs')
        .insert({
          title: title.trim(),
          subtitle: (subtitle || '').trim(),
          description: (description || '').trim(),
          features: Array.isArray(features) ? features : [],
          note: (note || '').trim(),
          cost: cost.trim(),
          display_order: display_order ?? 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) return jsonResponse({ error: error.message }, 500);
      await writeAuditLog(supabase, req, { action: 'CREATE', actorEmail: user.email, resourceId: data.id, metadata: { title: data.title } });
      return jsonResponse({ program: data }, 201);
    } catch (err) {
      return jsonResponse({ error: 'Invalid request body' }, 400);
    }
  }

  // ── PUT: update an existing program ──
  if (req.method === 'PUT') {
    try {
      const body = await req.json();
      const { id, title, subtitle, description, features, note, cost, display_order } = body;

      if (!id) {
        return jsonResponse({ error: 'Program id is required' }, 400);
      }
      if (!title || !cost) {
        return jsonResponse({ error: 'Title and cost are required' }, 400);
      }

      const fieldError = validateFields({ title, subtitle, description, features, note, cost });
      if (fieldError) return jsonResponse({ error: fieldError }, 400);

      const { data, error } = await supabase
        .from('addiction_programs')
        .update({
          title: title.trim(),
          subtitle: (subtitle || '').trim(),
          description: (description || '').trim(),
          features: Array.isArray(features) ? features : [],
          note: (note || '').trim(),
          cost: cost.trim(),
          display_order: display_order ?? 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return jsonResponse({ error: error.message }, 500);
      await writeAuditLog(supabase, req, { action: 'UPDATE', actorEmail: user.email, resourceId: id, metadata: { title: data.title } });
      return jsonResponse({ program: data });
    } catch (err) {
      return jsonResponse({ error: 'Invalid request body' }, 400);
    }
  }

  // ── DELETE: remove a program by id ──
  if (req.method === 'DELETE') {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Program id is required' }, 400);
    }

    const { error } = await supabase
      .from('addiction_programs')
      .delete()
      .eq('id', id);

    if (error) return jsonResponse({ error: error.message }, 500);
    await writeAuditLog(supabase, req, { action: 'DELETE', actorEmail: user.email, resourceId: id });
    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
};
