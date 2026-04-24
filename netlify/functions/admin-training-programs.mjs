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

const LIMITS = {
  title: 200,
  description: 2000,
  duration: 100,
  fee: 100,
  format: 200,
  levels_count: 10,
  level_label: 100,
  level_hours: 100,
  level_price: 100,
};

function validateFields({ title, description, duration, fee, format, levels }) {
  if (title       && title.length       > LIMITS.title)       return `Title must be ${LIMITS.title} characters or fewer`;
  if (description && description.length > LIMITS.description) return `Description must be ${LIMITS.description} characters or fewer`;
  if (duration    && duration.length    > LIMITS.duration)     return `Duration must be ${LIMITS.duration} characters or fewer`;
  if (fee         && fee.length         > LIMITS.fee)          return `Fee must be ${LIMITS.fee} characters or fewer`;
  if (format      && format.length      > LIMITS.format)       return `Format must be ${LIMITS.format} characters or fewer`;
  if (Array.isArray(levels)) {
    if (levels.length > LIMITS.levels_count) return `Maximum ${LIMITS.levels_count} levels allowed`;
    for (const l of levels) {
      if (l.label && l.label.length > LIMITS.level_label) return `Level label must be ${LIMITS.level_label} characters or fewer`;
      if (l.hours && l.hours.length > LIMITS.level_hours) return `Level hours must be ${LIMITS.level_hours} characters or fewer`;
      if (l.price && l.price.length > LIMITS.level_price) return `Level price must be ${LIMITS.level_price} characters or fewer`;
    }
  }
  return null;
}

async function writeAuditLog(supabase, req, { action, actorEmail, resourceId = null, metadata = {} }) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-nf-client-connection-ip')
            || null;
    await supabase.from('admin_audit_log').insert({
      action,
      actor_email: actorEmail ?? null,
      resource_type: 'training_program',
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !JWT_SECRET) {
    return jsonResponse({ error: 'Server misconfiguration' }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // GET: public list of active training programs
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('training_programs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ programs: data });
  }

  // All other methods require admin auth
  const user = verifyToken(req);
  if (!user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  // POST: create
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { category, title, description, levels, duration, fee, format, display_order } = body;

      if (!title) return jsonResponse({ error: 'Title is required' }, 400);
      if (!category || !['internship', 'traineeship'].includes(category)) {
        return jsonResponse({ error: 'Category must be internship or traineeship' }, 400);
      }

      const fieldError = validateFields({ title, description, duration, fee, format, levels });
      if (fieldError) return jsonResponse({ error: fieldError }, 400);

      const { data, error } = await supabase
        .from('training_programs')
        .insert({
          category,
          title: title.trim(),
          description: (description || '').trim(),
          levels: Array.isArray(levels) ? levels : [],
          duration: (duration || '').trim(),
          fee: (fee || '').trim(),
          format: (format || '').trim(),
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

  // PUT: update
  if (req.method === 'PUT') {
    try {
      const body = await req.json();
      const { id, category, title, description, levels, duration, fee, format, display_order } = body;

      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return jsonResponse({ error: 'Valid program id is required' }, 400);
      if (!title) return jsonResponse({ error: 'Title is required' }, 400);

      const fieldError = validateFields({ title, description, duration, fee, format, levels });
      if (fieldError) return jsonResponse({ error: fieldError }, 400);

      const updateData = {
        title: title.trim(),
        description: (description || '').trim(),
        levels: Array.isArray(levels) ? levels : [],
        duration: (duration || '').trim(),
        fee: (fee || '').trim(),
        format: (format || '').trim(),
        display_order: display_order ?? 0,
        updated_at: new Date().toISOString(),
      };
      if (category) updateData.category = category;

      const { data, error } = await supabase
        .from('training_programs')
        .update(updateData)
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

  // DELETE
  if (req.method === 'DELETE') {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return jsonResponse({ error: 'Valid program id is required' }, 400);

    const { error } = await supabase
      .from('training_programs')
      .delete()
      .eq('id', id);

    if (error) return jsonResponse({ error: error.message }, 500);
    await writeAuditLog(supabase, req, { action: 'DELETE', actorEmail: user.email, resourceId: id });
    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
};
