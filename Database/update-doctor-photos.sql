-- ============================================================
-- UPDATE DOCTOR PHOTOS — Hope Trust India
-- Run this in: Supabase Dashboard > SQL Editor
-- IDEMPOTENT — safe to re-run at any time.
-- Bucket: "Doctor images" (public)
-- ============================================================

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/Rajeshwari%20Luther.JPG'
WHERE name = 'Mrs. Rajeshwari Luther';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/dr%20vidyasagar.png'
WHERE name = 'Dr. Vidhya Sagar';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/muskan.jpg'
WHERE name = 'Ms. Muskan Gupta';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/Akansha-Kabra.jpg'
WHERE name = 'Ms. Akansha Kabra';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/sneha.jpg'
WHERE name = 'Ms. Sneha Sesha';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/Arani-Shankar.png'
WHERE name = 'Ms. Arani Shankar';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/nishanth.jpg'
WHERE name = 'Dr. Nishanth Vemana';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/dr%20aparna.jpeg'
WHERE name = 'Dr. K. Aparna';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/tina.jpg'
WHERE name = 'Dr. Justina Wilma Fernandes';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/purvi.jpg'
WHERE name = 'Ms. Purvi Maski';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/apeksha.png'
WHERE name = 'Ms. Apeksha';

UPDATE doctors SET photo = 'https://mjgbotzrjmwggzwkoovi.supabase.co/storage/v1/object/public/Doctor%20images/Shruti%20Sharma.png'
WHERE name = 'Ms. Shruti Sharma';

-- Verify updates
SELECT name, photo FROM doctors ORDER BY display_order;
