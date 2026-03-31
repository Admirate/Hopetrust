-- ============================================================
-- DOCTORS TABLE — Hope Trust India
-- Run this in: Supabase Dashboard > SQL Editor
-- IDEMPOTENT — safe to re-run at any time.
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS doctors (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text        NOT NULL,
  qualification  text        NOT NULL,
  department     text        NOT NULL,
  bio            text        NOT NULL DEFAULT '',
  booking_url    text        NOT NULL DEFAULT '',
  photo          text,
  is_active      boolean     NOT NULL DEFAULT true,
  display_order  integer     NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- 2. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS doctors_updated_at ON doctors;
CREATE TRIGGER doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3. Index for fast active-doctor queries ordered by display_order
CREATE INDEX IF NOT EXISTS idx_doctors_active_order
  ON doctors (is_active, display_order);

-- 4. Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DROP POLICY IF EXISTS "anon_select_doctors"   ON doctors;
DROP POLICY IF EXISTS "anon_insert_doctors"   ON doctors;
DROP POLICY IF EXISTS "anon_update_doctors"   ON doctors;
DROP POLICY IF EXISTS "anon_delete_doctors"   ON doctors;
DROP POLICY IF EXISTS "service_all_doctors"   ON doctors;

-- anon: SELECT only active doctors (public directory)
CREATE POLICY "anon_select_doctors" ON doctors
  FOR SELECT TO anon
  USING (is_active = true);

-- anon: explicitly block write operations
CREATE POLICY "anon_insert_doctors" ON doctors
  FOR INSERT TO anon WITH CHECK (false);

CREATE POLICY "anon_update_doctors" ON doctors
  FOR UPDATE TO anon USING (false);

CREATE POLICY "anon_delete_doctors" ON doctors
  FOR DELETE TO anon USING (false);

-- service_role: full access (dashboard, migrations)
CREATE POLICY "service_all_doctors" ON doctors
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================
-- 5. SEED DATA — all 12 current doctors
-- Uses INSERT ... ON CONFLICT DO NOTHING so re-runs are safe.
-- ============================================================

-- Temporary: disable RLS for seeding via SQL Editor (runs as postgres role)
-- No change needed — SQL Editor runs as superuser, bypasses RLS.

INSERT INTO doctors (name, qualification, department, bio, booking_url, photo, is_active, display_order) VALUES
(
  'Mrs. Rajeshwari Luther',
  'MA Psychology',
  'Psychology',
  'I''m Rajeshwari Luther, a counselling psychologist with over 25 years of experience in mental health, addiction treatment, family counselling and training. I believe listening to what my client has to say is the most important part of my practice.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48109&eid=48109',
  NULL, true, 1
),
(
  'Dr. Vidhya Sagar',
  'PhD in Clinical Psychology',
  'Psychology',
  'Dr Vidhya Sagar holds a PhD and M.Phil. (Clinical Psych) from the National Institute of Mental Health and Neurosciences (NIMHANS), Bangalore.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48124&eid=48109',
  NULL, true, 2
),
(
  'Ms. Muskan Gupta',
  'MPhil Clinical Psychology',
  'Psychology',
  'Muskan is an RCI-certified clinical psychologist.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48125&eid=48109',
  NULL, true, 3
),
(
  'Ms. Akansha Kabra',
  'MA Psychology',
  'Psychology',
  'Akansha is a Masters in Psychology and qualified in cognitive behaviour therapy, relaxation-based techniques, Imago relationship therapy, and play therapy.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48126&eid=48109',
  NULL, true, 4
),
(
  'Ms. Sneha Sesha',
  'MPhil in Social Work',
  'Social Work',
  'She is a highly skilled psychiatric social worker specializing in addiction recovery and mental health interventions.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=45153&eid=48109',
  NULL, true, 5
),
(
  'Ms. Arani Shankar',
  'PGDP in Clinical Psychology',
  'Psychology',
  'Arani is an RCI certified clinical psychologist.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48146&eid=48109',
  NULL, true, 6
),
(
  'Dr. Nishanth Vemana',
  'MD Psychiatry',
  'Psychiatry',
  'Dr Nishanth is an M.D. in psychiatry with over 14 years of experience.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=41861&eid=48109',
  NULL, true, 7
),
(
  'Dr. K. Aparna',
  'MD Psychiatry',
  'Psychiatry',
  'Dr. K Aparna is an experienced Neuropsychiatrist and certified life coach, offering specialized services in mental health and wellness. With expertise in addiction psychiatry, Dr. Aparna handles complex cases including psychosis and bipolar disorder. Fluent in both English and Telugu, she provides personalized, compassionate care.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48191&eid=48109',
  NULL, true, 8
),
(
  'Dr. Justina Wilma Fernandes',
  'PhD Psychology',
  'Psychology',
  'Dr. Tina Fernandes (MA, BEd, MPhil, PhD) has worked in the field of Research, Education and Mental Health for over 35 years.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48148&eid=48109',
  NULL, true, 9
),
(
  'Ms. Purvi Chottai',
  'MPhil Clinical Psychology',
  'Psychology',
  'Purvi is an RCI certified clinical psychologist with a MPhil in clinical psychology. She has vast experience supporting individuals suffering from anxiety, depression, addictions, adjusting to life''s transitions, grief, anger mismanagement, and emotional well-being.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=42507&eid=48109',
  NULL, true, 10
),
(
  'Ms. Apeksha',
  'PGDP in Clinical Psychology',
  'Psychology',
  'Apeksha is a licensed psychologist committed to providing personalized, compassionate care that meets each client where they are. Her approach is flexible and responsive — drawing from a range of evidence-based methods. She works with stress, depression, anxiety disorders, and adjustment disorders.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48264&eid=48109',
  NULL, true, 11
),
(
  'Ms. Shruti Sharma',
  'MSc Psychology',
  'Psychology',
  'Shruti is a Masters in Clinical Psychology from Jain University Bangalore. She works with students and young adults dealing with adjustment issues, anxiety, and stress management. Trained in queer affirmative therapy, family therapy, acceptance and commitment therapy, and other therapeutic approaches.',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48827&eid=48109',
  NULL, true, 12
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 6. VERIFICATION
-- ============================================================
SELECT
  id, name, department, is_active, display_order
FROM doctors
ORDER BY display_order;
