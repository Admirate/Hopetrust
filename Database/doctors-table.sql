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
  E'Rajeshwari Luther is a counselling psychologist with over 30 years of experience helping individuals, couples, and families find clarity, resilience, and a renewed sense of self.\n\nAreas of Expertise:\n\u2022 Relationships/ family therapy\n\u2022 Mental health & addiction recovery\n\u2022 Co-dependency & parenting challenges\n\u2022 Life transitions & everyday well-being\n\u2022 Corporate mental health & EAP programs\n\nTherapeutic Approaches:\n\u2022 Talk therapy & narrative therapy\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Art therapy & meditation\n\u2022 Certified & accredited EFT practitioner\n\nQualifications:\n\u2022 Master''s in Psychology\n\u2022 Healthcare Management \u2014 ISB Hyderabad\n\u2022 Addiction Treatment \u2014 Hazelden-Betty Ford, USA\n\u2022 International Certified Addiction Professional (ICAP 1)\n\u2022 Diploma in Art Therapy\n\nLanguages: English, Hindi & Telugu',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48109&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/Rajeshwari%20Luther.JPG', true, 1
),
(
  'Dr. Vidhya Sagar',
  'PhD in Clinical Psychology',
  'Psychology',
  E'Dr. Vidhya Sagar has over 11 years of clinical experience and four years in teaching.\n\nAreas of Expertise:\n\u2022 Anxiety, depression & OCD spectrum disorders\n\u2022 Substance & behavioural addictions (internet, sexual, pornography)\n\u2022 Psychotic disorders & pain management\n\u2022 Sexual dysfunctions & sleep-related issues\n\u2022 Couple, marital & parenting matters\n\nTherapeutic Approaches:\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Mindfulness-based therapies\n\u2022 Social skills & relaxation training\n\u2022 Psychometric testing\n\nQualifications:\n\u2022 PhD in Clinical Psychology \u2014 NIMHANS, Bangalore\n\u2022 M.Phil. in Clinical Psychology \u2014 NIMHANS, Bangalore\n\nLanguages: English, Hindi & Telugu',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48124&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/dr%20vidyasagar.png', true, 2
),
(
  'Ms. Muskan Gupta',
  'MPhil Clinical Psychology',
  'Psychology',
  E'Muskan is an RCI-certified clinical psychologist providing individual and couple counselling for both children and adults.\n\nAreas of Expertise:\n\u2022 Depression, anxiety & panic disorders\n\u2022 Eating disorders & PTSD\n\u2022 ADHD & adjustment disorders\n\u2022 Substance use & personality disorders\n\u2022 Psychometric testing\n\nTherapeutic Approaches:\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Acceptance & Commitment Therapy (ACT)\n\u2022 Schema-focused therapy\n\u2022 Dialectical Behaviour Therapy (DBT)\n\u2022 Exposure & Response Prevention (ERP)\n\u2022 Mindfulness therapy\n\nQualifications:\n\u2022 M.Phil. in Clinical Psychology \u2014 Manipal Academy of Higher Education',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48125&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/muskan.jpg', true, 3
),
(
  'Ms. Akansha Kabra',
  'MA Psychology',
  'Psychology',
  E'Akansha is a Masters in Psychology with an eclectic therapeutic approach, using a variety of therapies tailored to each client''s unique needs and overall well-being.\n\nAreas of Expertise:\n\u2022 Anxiety & anger management\n\u2022 Stress management & depression\n\u2022 Adjustment & self-esteem issues\n\u2022 Socio-emotional concerns\n\nTherapeutic Approaches:\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Relaxation-based techniques\n\u2022 Imago Relationship Therapy\n\u2022 Play Therapy\n\nLanguages: Hindi & English',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48126&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/Akansha-Kabra.jpg', true, 4
),
(
  'Ms. Sneha Sesha',
  'MPhil in Social Work',
  'Social Work',
  E'Sneha is a highly skilled psychiatric social worker specializing in addiction recovery and mental health interventions.\n\nAreas of Expertise:\n\u2022 Deaddiction & substance dependencies\n\u2022 Social skills training & cognitive retraining\n\u2022 Family counselling & psychoeducation\n\u2022 Mental health rehabilitation\n\nTherapeutic Approaches:\n\u2022 Cognitive Behavioural Therapy (CBT)\n\u2022 Motivational Enhancement Therapy (MET)\n\u2022 Family therapy & psychoeducation\n\u2022 Personalized recovery planning\n\nQualifications:\n\u2022 MPhil in Psychiatric Social Work \u2014 Manipal Academy of Higher Education\n\nLanguages: English, Telugu & Hindi',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=45153&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/sneha.jpg', true, 5
),
(
  'Ms. Arani Shankar',
  'PGDP in Clinical Psychology',
  'Psychology',
  E'Arani is an RCI-certified clinical psychologist with over 6 years of experience in evidence-based psychotherapies.\n\nAreas of Expertise:\n\u2022 Depression & OCD spectrum disorders\n\u2022 Anxiety & ADHD\n\u2022 Substance use & personality disorders\n\u2022 Couple & marital issues\n\u2022 Psychological assessments\n\nTherapeutic Approaches:\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Rational Emotive Behaviour Therapy (REBT)\n\u2022 Acceptance & Commitment Therapy (ACT)\n\u2022 Exposure & Response Prevention (ERP)\n\u2022 Mindfulness-based therapies & NLP\n\nQualifications:\n\u2022 Professional Diploma in Clinical Psychology\n\u2022 MSc Psychology \u2014 Acharya Nagarjuna University\n\nLanguages: English, Telugu & Hindi',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48146&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/Arani-Shankar.png', true, 6
),
(
  'Dr. Nishanth Vemana',
  'MD Psychiatry',
  'Psychiatry',
  E'Dr. Nishanth is an M.D. in Psychiatry with over 14 years of experience. His work in rehabilitation and clinical settings has reinforced his belief that "there is no health without mental health."\n\nAreas of Expertise:\n\u2022 Substance addiction & rehabilitation\n\u2022 Chronic mental illness \u2014 schizophrenia, bipolar disorder\n\u2022 Depression, anxiety & OCD\n\nLanguages: Hindi, English, Telugu & Kannada',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=41861&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/nishanth.jpg', true, 7
),
(
  'Dr. K. Aparna',
  'MD Psychiatry',
  'Psychiatry',
  E'Dr. K Aparna is an experienced Neuropsychiatrist and certified life coach, offering specialized services in mental health and wellness.\n\nAreas of Expertise:\n\u2022 Addiction psychiatry\n\u2022 Psychosis & bipolar disorder\n\u2022 Depression, anxiety & OCD\n\u2022 Personality disorders\n\u2022 Adolescent psychiatry\n\u2022 Senile dementia care\n\nQualifications:\n\u2022 MD in Psychiatry\n\nLanguages: English & Telugu',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48191&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/dr%20aparna.jpeg', true, 8
),
(
  'Dr. Justina Wilma Fernandes',
  'PhD Psychology',
  'Psychology',
  E'Dr. Tina Fernandes has worked in Research, Education, and Mental Health for over 35 years. She is committed to empowering individuals to break cycles, heal, and reclaim their agency.\n\nAreas of Expertise:\n\u2022 Managing personal relationships\n\u2022 Life transitions & adjustment\n\u2022 Anxiety, depression & trauma\n\u2022 Disruptive behaviours & self-esteem\n\u2022 Adolescent & adult psychological issues\n\nTherapeutic Approaches:\n\u2022 Narrative therapy\n\u2022 Mindfulness-based therapy\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Person-centred therapy\n\u2022 Psychoanalytic psychotherapy\n\nQualifications:\n\u2022 MA, BEd, MPhil, PhD in Psychology\n\nLanguages: English & Hindi',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48148&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/tina.jpg', true, 9
),
(
  'Ms. Purvi Maski',
  'MPhil Clinical Psychology',
  'Psychology',
  E'Purvi is an RCI-certified clinical psychologist and certified marital & family therapist, specializing in heterosexual and LGBTQ+ couples and families.\n\nAreas of Expertise:\n\u2022 Anxiety, depression & grief\n\u2022 Addiction & emotional disturbances\n\u2022 Life transitions & anger management\n\u2022 Stress, pre- & post-operative counselling\n\u2022 Pain management & adolescent issues\n\u2022 LGBTQ+ couple & family therapy\n\nTherapeutic Approaches:\n\u2022 Emotionally Focused Therapy (EFT)\n\u2022 Solution-driven, evidence-based integrative approach\n\nQualifications:\n\u2022 MPhil in Clinical Psychology\n\u2022 MSc Health Psychology \u2014 Central University, Hyderabad\n\nLanguages: Hindi, English & Gujarati',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=42507&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/purvi.jpg', true, 10
),
(
  'Ms. Apeksha',
  'PGDP in Clinical Psychology',
  'Psychology',
  E'Apeksha is a licensed psychologist committed to providing personalized, compassionate care that meets each client where they are. Her approach is flexible and responsive, drawing from evidence-based methods.\n\nAreas of Expertise:\n\u2022 Stress & depression\n\u2022 Anxiety disorders\n\u2022 Adjustment disorders\n\nQualifications:\n\u2022 Professional Diploma in Clinical Psychology \u2014 Sweekaar Academy of Rehabilitation Sciences, Hyderabad\n\nLanguages: English & Hindi',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48264&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/apeksha.png', true, 11
),
(
  'Ms. Shruti Sharma',
  'MSc Psychology',
  'Psychology',
  E'Shruti is a Masters in Clinical Psychology from Jain University, Bangalore. As a Gen Z therapist, students find her particularly relatable.\n\nAreas of Expertise:\n\u2022 Anxiety, depression & stress management\n\u2022 Gender identity & sexuality\n\u2022 Body image & self-esteem challenges\n\u2022 Substance use & exam stress\n\u2022 Career confusion & academic performance anxiety\n\u2022 Social anxiety & boundary setting\n\nTherapeutic Approaches:\n\u2022 CBT, DBT & Acceptance and Commitment Therapy (ACT)\n\u2022 Queer Affirmative Therapy\n\u2022 Family Therapy & Systematic Desensitisation\n\nQualifications:\n\u2022 MSc Clinical Psychology \u2014 Jain University, Bangalore\n\u2022 Diploma in Organizational Psychology\n\nLanguages: Hindi, English, Urdu, Dogri & Punjabi',
  'https://meet-my-doctor.firebaseapp.com/#/?uid=48827&eid=48109',
  'https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/Doctor%20images/Shruti%20Sharma.png', true, 12
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 6. VERIFICATION
-- ============================================================
SELECT
  id, name, department, is_active, display_order
FROM doctors
ORDER BY display_order;
