import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

// ── Rate limiting config ──────────────────────────────────────────────────────
const MAX_FAILED_ATTEMPTS = 5;    // lock after this many consecutive failures
const LOCKOUT_MINUTES = 15;       // duration of each lockout window
const MAX_EMAIL_LENGTH = 200;     // reject absurdly long inputs before DB round-trip
const MAX_PASSWORD_LENGTH = 128;  // bcrypt silently truncates at 72 bytes — cap early

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.URL || 'https://hopetrustindia.com',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** Fire-and-forget audit log write. Never throws — never blocks the response. */
async function writeAuditLog(supabase, req, { action, actorEmail, metadata = {} }) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-nf-client-connection-ip')
            || null;
    await supabase.from('admin_audit_log').insert({
      action,
      actor_email: actorEmail ?? null,
      resource_type: 'session',
      resource_id: null,
      metadata,
      ip_address: ip,
    });
  } catch (err) {
    console.error('[audit]', err);
  }
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', ...extra },
  });
}

export default async (req) => {
  // ── CORS preflight ──────────────────────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !JWT_SECRET) {
    return json({ error: 'Server misconfiguration' }, 500);
  }

  // ── Content-Type guard ──────────────────────────────────────────────────────
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return json({ error: 'Content-Type must be application/json' }, 415);
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    // ── Basic presence check ────────────────────────────────────────────────
    if (!email || !password) {
      return json({ error: 'Email and password are required' }, 400);
    }

    // ── Input length limits ─────────────────────────────────────────────────
    // Use generic message to avoid confirming whether an email exists
    if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH ||
        typeof password !== 'string' || password.length > MAX_PASSWORD_LENGTH) {
      return json({ error: 'Invalid credentials' }, 401);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // ── Fetch user (service role bypasses RLS) ──────────────────────────────
    const { data: user, error: fetchError } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, failed_attempts, locked_until')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (fetchError || !user) {
      // Generic message — do not reveal whether the email exists
      return json({ error: 'Invalid credentials' }, 401);
    }

    const now = new Date();

    // ── Check if account is actively locked ─────────────────────────────────
    if (user.locked_until && new Date(user.locked_until) > now) {
      const remainingMs = new Date(user.locked_until) - now;
      const retryAfterSecs = Math.ceil(remainingMs / 1000);
      const remainingMins = Math.ceil(remainingMs / 60000);
      await writeAuditLog(supabase, req, { action: 'LOGIN_BLOCKED', actorEmail: user.email, metadata: { locked_until: user.locked_until } });
      return json(
        {
          error: `Account temporarily locked. Try again in ${remainingMins} minute${remainingMins === 1 ? '' : 's'}.`,
          locked: true,
          retryAfter: retryAfterSecs,
        },
        429,
        { 'Retry-After': String(retryAfterSecs) }
      );
    }

    // ── Determine effective failed-attempt counter ───────────────────────────
    // If the previous lockout has now expired, treat the counter as reset so
    // the user gets a fresh MAX_FAILED_ATTEMPTS window after waiting.
    const lockoutExpired = user.locked_until && new Date(user.locked_until) <= now;
    const currentFailedAttempts = lockoutExpired ? 0 : (user.failed_attempts ?? 0);

    // ── Verify password ─────────────────────────────────────────────────────
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      const newFailedAttempts = currentFailedAttempts + 1;
      const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;
      const lockedUntil = shouldLock
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString()
        : null;

      // Persist updated counters (trigger auto-updates updated_at)
      await supabase
        .from('admin_users')
        .update({
          failed_attempts: newFailedAttempts,
          locked_until: lockedUntil,
        })
        .eq('id', user.id);

      if (shouldLock) {
        const retryAfterSecs = LOCKOUT_MINUTES * 60;
        await writeAuditLog(supabase, req, { action: 'ACCOUNT_LOCKED', actorEmail: user.email, metadata: { locked_until: lockedUntil, failed_attempts: newFailedAttempts } });
        return json(
          {
            error: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.`,
            locked: true,
            retryAfter: retryAfterSecs,
          },
          429,
          { 'Retry-After': String(retryAfterSecs) }
        );
      }

      const attemptsLeft = MAX_FAILED_ATTEMPTS - newFailedAttempts;
      await writeAuditLog(supabase, req, { action: 'LOGIN_FAILED', actorEmail: user.email, metadata: { attempts_remaining: attemptsLeft } });
      return json({ error: 'Invalid credentials' }, 401);
    }

    // ── Successful login — reset rate-limit counters ─────────────────────────
    await supabase
      .from('admin_users')
      .update({ failed_attempts: 0, locked_until: null })
      .eq('id', user.id);

    // ── Audit successful login ─────────────────────────────────────────────
    await writeAuditLog(supabase, req, { action: 'LOGIN_SUCCESS', actorEmail: user.email });

    // ── Issue JWT (24-hour expiry) ───────────────────────────────────────────
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return json({ token, email: user.email }, 200);

  } catch (err) {
    console.error('Login error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
};
