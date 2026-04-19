-- ─────────────────────────────────────────────────────────────────────────────
-- Admin Security Migration
-- Adds rate-limiting columns to admin_users.
-- Safe to run on a live table: ADD COLUMN IF NOT EXISTS with DEFAULT values
-- means existing rows receive the default (0 / NULL) with no data loss.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Track consecutive failed login attempts per admin account
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS failed_attempts integer NOT NULL DEFAULT 0;

-- 2. When non-null and in the future, the account is locked
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS locked_until timestamptz DEFAULT NULL;

-- 3. Index for fast lockout lookups (only needed if you ever query it separately)
CREATE INDEX IF NOT EXISTS idx_admin_users_locked_until
  ON admin_users (locked_until)
  WHERE locked_until IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verify (run manually to confirm):
-- SELECT id, email, failed_attempts, locked_until FROM admin_users;
-- ─────────────────────────────────────────────────────────────────────────────
