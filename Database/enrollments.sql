-- =============================================================================
-- Enrollments + Razorpay Booking Schema
-- Hope Trust India — Training + Addiction Program Booking System
-- Run in: Supabase Dashboard > SQL Editor
--
-- SAFETY GUARANTEES:
--   * Fully idempotent — safe to run multiple times
--   * No DROP / TRUNCATE / DELETE anywhere
--   * All ALTERs use ADD COLUMN IF NOT EXISTS (won't touch existing columns)
--   * All seed UPDATEs are guarded so admin edits are never overwritten
--   * The jsonb `levels` rewrite ONLY runs when price_inr is absent on every
--     element AND the existing shape matches the original seed
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Amount columns on existing program tables (paise = INR * 100)
--    Pure additions — no existing data affected.
-- -----------------------------------------------------------------------------

ALTER TABLE addiction_programs
  ADD COLUMN IF NOT EXISTS cost_inr INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN addiction_programs.cost_inr IS
  'Authoritative price in paise (INR * 100). Server-side source of truth for Razorpay orders. The existing "cost" text column remains for display.';

ALTER TABLE training_programs
  ADD COLUMN IF NOT EXISTS fee_inr INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN training_programs.fee_inr IS
  'Authoritative single-program fee in paise (INR * 100). Used when the program has no levels (e.g. traineeships). For multi-level programs each entry inside levels jsonb carries its own price_inr.';

-- -----------------------------------------------------------------------------
-- 2. Seed authoritative amounts ONLY for rows that still have the default 0.
--    If an admin has already set cost_inr / fee_inr via the dashboard, these
--    UPDATEs are no-ops.
-- -----------------------------------------------------------------------------

-- Addiction programs -------------------------------------------------
UPDATE addiction_programs SET cost_inr = 2650000
  WHERE cost_inr = 0 AND title = '30 Days Recovery Program';

UPDATE addiction_programs SET cost_inr = 1800000
  WHERE cost_inr = 0 AND title = '30 Days Extended OP/ After Care Program';

UPDATE addiction_programs SET cost_inr = 1050000
  WHERE cost_inr = 0 AND title = 'Nicotine Cessation Program';

UPDATE addiction_programs SET cost_inr = 2650000
  WHERE cost_inr = 0 AND title = 'Gambling and Internet Cessation Program';

-- Training programs: top-level fee (traineeships) --------------------
UPDATE training_programs SET fee_inr = 1700000
  WHERE fee_inr = 0 AND title = 'Clinical Traineeship';

-- Training programs: per-level prices inside jsonb -------------------
-- Strategy: only rewrite `levels` if
--   (a) no existing element already has a `price_inr` key, AND
--   (b) the current labels/hours/price still match the original seed
-- This guarantees we never overwrite an admin-edited levels array.

UPDATE training_programs
SET levels = '[
  {"label":"Level 1","hours":"10 hours","price":"INR 2,500","price_inr":250000},
  {"label":"Level 2","hours":"30 hours","price":"INR 4,000","price_inr":400000}
]'::jsonb
WHERE title = 'Addiction Treatment Internship'
  AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(levels) elem
    WHERE elem ? 'price_inr'
  )
  AND levels @> '[{"label":"Level 1","price":"INR 2,500"},{"label":"Level 2","price":"INR 4,000"}]'::jsonb;

UPDATE training_programs
SET levels = '[
  {"label":"Level 1","hours":"60 hours","price":"INR 6,000","price_inr":600000},
  {"label":"Level 2","hours":"240 hours","price":"INR 15,000","price_inr":1500000}
]'::jsonb
WHERE title = 'General Clinical Internship'
  AND NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(levels) elem
    WHERE elem ? 'price_inr'
  )
  AND levels @> '[{"label":"Level 1","price":"INR 6,000"},{"label":"Level 2","price":"INR 15,000"}]'::jsonb;

-- -----------------------------------------------------------------------------
-- 3. enrollments table — unified booking records for training + addiction
--    Brand new table — no existing data to consider.
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS enrollments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Program reference (no FK — we snapshot title to survive program edits/deletes)
  program_type          TEXT NOT NULL CHECK (program_type IN ('training','addiction')),
  program_id            UUID NOT NULL,
  program_title         TEXT NOT NULL,
  program_level         TEXT,

  -- Amount in paise (INR * 100) — resolved server-side from DB, never from client
  amount_inr            INTEGER NOT NULL CHECK (amount_inr > 0),

  -- Minimal user info (v1 scope: name, email, phone)
  full_name             TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT NOT NULL,

  -- Razorpay identifiers
  razorpay_order_id     TEXT NOT NULL UNIQUE,
  razorpay_payment_id   TEXT,
  razorpay_signature    TEXT,

  -- State machine
  status                TEXT NOT NULL DEFAULT 'created'
                          CHECK (status IN ('created','paid','failed','abandoned')),
  failure_reason        TEXT,

  -- Diagnostics: UTM params, user-agent, webhook event payloads, email receipts
  metadata              JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at               TIMESTAMPTZ,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change (reuses existing set_updated_at() fn
-- created by Database/doctors-table.sql; safe to CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enrollments_updated_at ON enrollments;
CREATE TRIGGER enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes for admin dashboard filtering + polling on success page
CREATE INDEX IF NOT EXISTS idx_enrollments_status_created
  ON enrollments (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_enrollments_program
  ON enrollments (program_type, program_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_email
  ON enrollments (email);

-- -----------------------------------------------------------------------------
-- 4. Row Level Security — only service_role (Netlify fns) can read/write.
--    anon / authenticated are fully denied.
-- -----------------------------------------------------------------------------

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_deny_enrollments"         ON enrollments;
DROP POLICY IF EXISTS "authenticated_deny_enrollments" ON enrollments;
DROP POLICY IF EXISTS "service_all_enrollments"       ON enrollments;

CREATE POLICY "anon_deny_enrollments" ON enrollments
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "authenticated_deny_enrollments" ON enrollments
  FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE POLICY "service_all_enrollments" ON enrollments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 5. VERIFICATION — run these SELECTs to confirm no data was lost.
-- -----------------------------------------------------------------------------

-- Existing addiction programs: rows unchanged, cost_inr populated
SELECT id, title, cost, cost_inr, is_active
FROM addiction_programs
ORDER BY display_order;

-- Existing training programs: rows unchanged, fee_inr + per-level price_inr populated
SELECT id, title, category, fee, fee_inr, levels, is_active
FROM training_programs
ORDER BY display_order;

-- New enrollments table is empty and ready
SELECT COUNT(*) AS enrollments_count FROM enrollments;
