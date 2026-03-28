-- ============================================================
-- Hope Trust — Row Level Security Policies
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Enable RLS on all form submission tables ─────────────────────────────

ALTER TABLE contact_submissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE joinus_applications     ENABLE ROW LEVEL SECURITY;

-- ─── 2. contact_submissions — anon INSERT only ───────────────────────────────

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "anon_insert_contact"    ON contact_submissions;
DROP POLICY IF EXISTS "service_all_contact"    ON contact_submissions;

-- Public: insert-only (no read, no update, no delete)
CREATE POLICY "anon_insert_contact"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated service role: full access for admin/HR use
CREATE POLICY "service_all_contact"
  ON contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── 3. newsletter_subscribers — anon INSERT only ────────────────────────────

DROP POLICY IF EXISTS "anon_insert_newsletter"  ON newsletter_subscribers;
DROP POLICY IF EXISTS "service_all_newsletter"  ON newsletter_subscribers;

CREATE POLICY "anon_insert_newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "service_all_newsletter"
  ON newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── 4. joinus_applications — anon INSERT only ───────────────────────────────

DROP POLICY IF EXISTS "anon_insert_joinus"  ON joinus_applications;
DROP POLICY IF EXISTS "service_all_joinus"  ON joinus_applications;

CREATE POLICY "anon_insert_joinus"
  ON joinus_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "service_all_joinus"
  ON joinus_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── 5. Storage: cv-uploads bucket ───────────────────────────────────────────
--
-- IMPORTANT: Run these AFTER enabling RLS on the storage.objects table.
-- In Supabase dashboard: Storage → cv-uploads → Policies
--
-- Alternatively apply via SQL:

DROP POLICY IF EXISTS "anon_upload_cv"  ON storage.objects;
DROP POLICY IF EXISTS "anon_read_cv"    ON storage.objects;
DROP POLICY IF EXISTS "service_all_cv"  ON storage.objects;

-- Anon may upload files to cv-uploads IF the extension is pdf/doc/docx
CREATE POLICY "anon_upload_cv"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'cv-uploads'
    AND (storage.filename(name) ~* '\.(pdf|doc|docx)$')
  );

-- Anon may read files (needed for getPublicUrl to resolve)
-- TODO: Once an HR portal exists, restrict to authenticated role and use
--       signed URLs instead of public URLs for CV downloads.
CREATE POLICY "anon_read_cv"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'cv-uploads');

-- Service role: full control
CREATE POLICY "service_all_cv"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'cv-uploads')
  WITH CHECK (bucket_id = 'cv-uploads');

-- ─── 6. Storage: assets bucket ───────────────────────────────────────────────
--
-- The assets bucket is public read-only.
-- No anon writes; only the service role can upload new assets.

DROP POLICY IF EXISTS "public_read_assets"   ON storage.objects;
DROP POLICY IF EXISTS "service_write_assets" ON storage.objects;

CREATE POLICY "public_read_assets"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'assets');

CREATE POLICY "service_write_assets"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'assets')
  WITH CHECK (bucket_id = 'assets');

-- ─── Verification queries ─────────────────────────────────────────────────────
-- Run these to confirm policies are active:
--
-- SELECT tablename, rowsecurity FROM pg_tables
--   WHERE tablename IN ('contact_submissions','newsletter_subscribers','joinus_applications');
--
-- SELECT schemaname, tablename, policyname, roles, cmd
--   FROM pg_policies
--   WHERE tablename IN ('contact_submissions','newsletter_subscribers','joinus_applications','objects')
--   ORDER BY tablename, policyname;
