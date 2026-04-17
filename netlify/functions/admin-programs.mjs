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
    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
};
