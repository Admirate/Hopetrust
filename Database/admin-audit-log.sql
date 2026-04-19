-- ─────────────────────────────────────────────────────────────────────────────
-- Admin Audit Log
-- Immutable append-only log of all admin actions.
-- Written server-side only (service_role). Zero public access via RLS.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  action        text        NOT NULL,
  -- Actions: LOGIN_SUCCESS | LOGIN_FAILED | ACCOUNT_LOCKED | LOGIN_BLOCKED
  --          CREATE | UPDATE | DELETE
  actor_email   text,                         -- null only for unauthenticated failures
  resource_type text,                         -- 'program' | 'session'
  resource_id   text,                         -- affected record UUID (programs) or null
  metadata      jsonb       NOT NULL DEFAULT '{}',
  ip_address    text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries (most recent first, by actor, by action type)
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at   ON admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_email  ON admin_audit_log (actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_log_action       ON admin_audit_log (action);

-- ── RLS: no public or authenticated access — only service_role may write/read ──
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_deny_anon"
  ON admin_audit_log FOR ALL TO anon USING (false);

CREATE POLICY "audit_log_deny_authenticated"
  ON admin_audit_log FOR ALL TO authenticated USING (false);

-- ─────────────────────────────────────────────────────────────────────────────
-- Verify (run manually):
-- SELECT action, actor_email, resource_type, resource_id, metadata, ip_address, created_at
-- FROM admin_audit_log ORDER BY created_at DESC LIMIT 20;
-- ─────────────────────────────────────────────────────────────────────────────
