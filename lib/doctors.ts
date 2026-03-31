import { supabase } from '@/lib/supabase';

export type Doctor = {
  id: string;
  name: string;
  qualification: string;
  department: string;
  bio: string;
  bookingUrl: string;
  photo?: string;
  displayOrder: number;
};

type DoctorRow = {
  id: string;
  name: string;
  qualification: string;
  department: string;
  bio: string;
  booking_url: string;
  photo: string | null;
  display_order: number;
};

function rowToDoctor(row: DoctorRow): Doctor {
  return {
    id: row.id,
    name: row.name,
    qualification: row.qualification,
    department: row.department,
    bio: row.bio,
    bookingUrl: row.booking_url,
    photo: row.photo ?? undefined,
    displayOrder: row.display_order,
  };
}

export async function fetchDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select('id, name, qualification, department, bio, booking_url, photo, display_order')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as DoctorRow[]).map(rowToDoctor);
}

export async function fetchDepartments(): Promise<string[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select('department')
    .eq('is_active', true);

  if (error) throw new Error(error.message);
  return Array.from(new Set((data as { department: string }[]).map((r) => r.department))).sort();
}
