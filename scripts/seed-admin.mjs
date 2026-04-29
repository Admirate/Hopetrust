
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (not the anon key).
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    '❌  Missing env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.\n' +
    '    Run with: node --env-file=.env.local scripts/seed-admin.mjs <email> <password>'
  );
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node scripts/seed-admin.mjs <email> <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('❌  Password must be at least 8 characters.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const SALT_ROUNDS = 12;
const hash = await bcrypt.hash(password, SALT_ROUNDS);

const { data, error } = await supabase
  .from('admin_users')
  .upsert({ email, password_hash: hash }, { onConflict: 'email' })
  .select('id, email')
  .single();

if (error) {
  console.error('❌  Failed to seed admin user:', error.message);
  process.exit(1);
}

console.log(`✅  Admin user ready: ${data.email} (id: ${data.id})`);
