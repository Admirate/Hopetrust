-- =============================================================================
-- Admin Dashboard Schema
-- Run this in your Supabase SQL Editor
-- =============================================================================

-- 1. Admin users table (bcrypt-hashed passwords)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Addiction programs (managed via admin dashboard)
CREATE TABLE IF NOT EXISTS addiction_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  features TEXT[] DEFAULT '{}',
  note TEXT DEFAULT '',
  cost TEXT NOT NULL DEFAULT '',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addiction_programs ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for admin_users
--    No public access at all — only service role key can read/write
CREATE POLICY "No public access to admin_users"
  ON admin_users FOR ALL
  TO anon
  USING (false);

-- 5. RLS policies for addiction_programs
--    Public can read active programs (for the addiction page)
CREATE POLICY "Public can read active programs"
  ON addiction_programs FOR SELECT
  TO anon
  USING (is_active = true);

--    No public insert/update/delete
CREATE POLICY "No public write to programs"
  ON addiction_programs FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "No public update to programs"
  ON addiction_programs FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "No public delete to programs"
  ON addiction_programs FOR DELETE
  TO anon
  USING (false);

-- 6. Seed the 4 existing programs so the page works immediately
INSERT INTO addiction_programs (title, subtitle, description, features, note, cost, display_order) VALUES
(
  '30 Days Recovery Program',
  'Who can benefit?',
  'The 30 Days Recovery Program focuses on helping your loved one overcome addiction. We have qualified therapists who can assist you online and offline. This program focuses on both, individual and family counselling. Post the completion of this program, you can also opt for our 30 days extended program.',
  ARRAY[
    '2 weekly sessions by an addiction counsellor',
    '2 sessions with family',
    'Essential Step Work with a primary counsellor',
    '2 consultations with a psychiatrist.',
    'Relapse prevention strategies tailored for the individual',
    'Followed by after-care sessions which are chargeable'
  ],
  'Note: Any psychometric tests required will be charged extra. Medical tests are to be arranged by the client.',
  'INR 26,500',
  1
),
(
  '30 Days Extended OP/ After Care Program',
  'Who can benefit?',
  'The aftercare program focuses on relapse prevention and is ideal for patients who have recently completed an inpatient program at a rehab or after completing any of our packages. This package offers increased after-care support to address ongoing issues arising in initial stages of recovery. It is proven to minimize risk of relapse and builds self confidence.',
  ARRAY[
    'Support services are offered for one hour a day, once a week for 4 weeks/one session by psychiatrist',
    'Comprehensive evaluations, assessments, holistic treatment, and continued abstinence are some of the program''s goals.',
    'Individualized treatment plan, comprehensive care and support by a team of qualified experts.'
  ],
  'Note: Any psychometric tests required will be charged extra. Medical tests are to be arranged by the client.',
  'INR 18,000',
  2
),
(
  'Nicotine Cessation Program',
  'Kick the habit',
  '',
  ARRAY[
    'For cigarettes and all tobacco products',
    'Four sessions spread over 10 days with an addiction counsellor',
    'One consultation with a psychiatrist. NRT medications may be suggested',
    'Follow-up sessions are chargeable'
  ],
  '',
  'INR 10,500',
  3
),
(
  'Gambling and Internet Cessation Program',
  'What do you get?',
  '',
  ARRAY[
    'Eight sessions by an addiction counsellor',
    'Two sessions with family',
    'Essential Step Work with a primary counsellor',
    '1 or 2 consultations with a psychiatrist, if needed',
    'Relapse prevention strategies tailored for the individual',
    'Followed by after-care sessions.'
  ],
  '',
  'INR 26,500',
  4
);
