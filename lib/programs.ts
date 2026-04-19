/** Thrown by any programs API call that receives HTTP 401. Callers should auto-logout. */
export class UnauthorizedError extends Error {
  constructor() {
    super('Session expired. Please log in again.');
    this.name = 'UnauthorizedError';
  }
}

export interface AddictionProgram {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  note: string;
  cost: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE = '/.netlify/functions/admin-programs';

/** Fetch active programs (public, no auth needed) */
export async function fetchPrograms(): Promise<AddictionProgram[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch programs');
  const json = await res.json();
  return json.programs;
}

/** Create a program (admin auth required) */
export async function createProgram(
  token: string,
  program: Omit<AddictionProgram, 'id' | 'is_active' | 'created_at' | 'updated_at'>
): Promise<AddictionProgram> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(program),
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create program');
  }
  const json = await res.json();
  return json.program;
}

/** Update a program (admin auth required) */
export async function updateProgram(
  token: string,
  program: Partial<AddictionProgram> & { id: string }
): Promise<AddictionProgram> {
  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(program),
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update program');
  }
  const json = await res.json();
  return json.program;
}

/** Delete a program (admin auth required) */
export async function deleteProgram(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}?id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete program');
  }
}
