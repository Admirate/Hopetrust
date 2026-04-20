-- =============================================================================
-- Training Programs Schema
-- Run this in your Supabase SQL Editor
-- =============================================================================

-- 1. Training programs table (managed via admin dashboard)
CREATE TABLE IF NOT EXISTS training_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'internship',  -- 'internship' or 'traineeship'
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  levels JSONB DEFAULT '[]',                     -- [{ "label": "Level 1", "hours": "10 hours", "price": "INR 2,500" }]
  duration TEXT DEFAULT '',
  fee TEXT DEFAULT '',
  format TEXT DEFAULT '',                        -- e.g. 'Online and on site', 'On site only'
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies
CREATE POLICY "Public can read active training programs"
  ON training_programs FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "No public insert to training programs"
  ON training_programs FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "No public update to training programs"
  ON training_programs FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "No public delete to training programs"
  ON training_programs FOR DELETE
  TO anon
  USING (false);

-- 4. Seed the existing programs
INSERT INTO training_programs (category, title, description, levels, duration, fee, format, display_order) VALUES
(
  'internship',
  'Addiction Treatment Internship',
  'Focused on addiction, recovery, and co occurring concerns in a therapeutic setting.',
  '[{"label": "Level 1", "hours": "10 hours", "price": "INR 2,500"}, {"label": "Level 2", "hours": "30 hours", "price": "INR 4,000"}]'::jsonb,
  '',
  '',
  'Available online and on site.',
  1
),
(
  'internship',
  'General Clinical Internship',
  'Focused on counselling psychology, clinical psychology, and addiction related work through classes and experiential learning.',
  '[{"label": "Level 1", "hours": "60 hours", "price": "INR 6,000"}, {"label": "Level 2", "hours": "240 hours", "price": "INR 15,000"}]'::jsonb,
  '',
  '',
  'Available online and on site.',
  2
),
(
  'traineeship',
  'Clinical Traineeship',
  'A more advanced training space for early career psychologists who are ready for supervised casework, assessments, interventions, case discussions, and clinical learning within an interdisciplinary setting.',
  '[]'::jsonb,
  '3 months',
  'INR 17,000',
  'On site only',
  3
);
