#!/usr/bin/env node

/**
 * Refresh data/doctors-snapshot.json from Supabase.
 *
 * The snapshot is the build-time fallback for the therapist directory: if
 * Supabase is unreachable during a Netlify build, the site ships slightly stale
 * practitioners rather than failing the deploy. Run this after adding, removing
 * or editing a practitioner so the fallback does not drift.
 *
 *   npm run snapshot:doctors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'data', 'doctors-snapshot.json');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set.\n' +
      'Run with: node --env-file=.env scripts/snapshot-doctors.mjs'
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error } = await supabase
  .from('doctors')
  .select('id, name, qualification, department, bio, booking_url, photo, display_order')
  .eq('is_active', true)
  .order('display_order', { ascending: true });

if (error) {
  console.error('Supabase read failed:', error.message);
  process.exit(1);
}

if (!data || data.length === 0) {
  console.error('Refusing to write an empty snapshot — the query returned no active rows.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    { capturedAt: new Date().toISOString().split('T')[0], doctors: data },
    null,
    2
  ) + '\n'
);

console.log(`Wrote ${data.length} practitioners to data/doctors-snapshot.json`);
