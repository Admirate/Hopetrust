export class UnauthorizedError extends Error {
  constructor() {
    super('Session expired. Please log in again.');
    this.name = 'UnauthorizedError';
  }
}

export interface TrainingProgramLevel {
  label: string;
  hours: string;
  price: string;
}

export interface TrainingProgram {
  id: string;
  category: 'internship' | 'traineeship';
  title: string;
  description: string;
  levels: TrainingProgramLevel[];
  duration: string;
  fee: string;
  format: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE = '/.netlify/functions/admin-training-programs';

/** Fetch active training programs (public, no auth needed) */
export async function fetchTrainingPrograms(): Promise<TrainingProgram[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch training programs');
  const json = await res.json();
  return json.programs;
}

/** Create a training program (admin auth required) */
export async function createTrainingProgram(
  token: string,
  program: Omit<TrainingProgram, 'id' | 'is_active' | 'created_at' | 'updated_at'>
): Promise<TrainingProgram> {
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
    throw new Error(err.error || 'Failed to create training program');
  }
  const json = await res.json();
  return json.program;
}

/** Update a training program (admin auth required) */
export async function updateTrainingProgram(
  token: string,
  program: Partial<TrainingProgram> & { id: string }
): Promise<TrainingProgram> {
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
    throw new Error(err.error || 'Failed to update training program');
  }
  const json = await res.json();
  return json.program;
}

/** Delete a training program (admin auth required) */
export async function deleteTrainingProgram(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}?id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete training program');
  }
}
