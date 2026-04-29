// =============================================================================
// Admin client for /.netlify/functions/admin-enrollments
// Used by the Enrollments tab in the admin dashboard.
// =============================================================================

export class UnauthorizedError extends Error {
  constructor() {
    super('Session expired. Please log in again.');
    this.name = 'UnauthorizedError';
  }
}

export type EnrollmentStatus = 'created' | 'paid' | 'failed' | 'abandoned';
export type ProgramType = 'training' | 'addiction';

export interface AdminEnrollment {
  id: string;
  created_at: string;
  status: EnrollmentStatus;
  program_type: ProgramType;
  program_id: string;
  program_title: string;
  program_level: string | null;
  amount_inr: number;          // paise
  full_name: string;
  email: string;
  phone: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  paid_at: string | null;
  failure_reason: string | null;
  metadata: Record<string, unknown> | null;
}

export interface EnrollmentFilters {
  status?: EnrollmentStatus | '';
  program_type?: ProgramType | '';
  program_id?: string;
  from?: string;   // ISO date (yyyy-mm-dd or full ISO)
  to?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export interface EnrollmentListResponse {
  enrollments: AdminEnrollment[];
  total: number;
  limit: number;
  offset: number;
}

const API_BASE = '/.netlify/functions/admin-enrollments';

function buildQuery(filters: EnrollmentFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.program_type) params.set('program_type', filters.program_type);
  if (filters.program_id) params.set('program_id', filters.program_id);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.q) params.set('q', filters.q);
  if (typeof filters.limit === 'number') params.set('limit', String(filters.limit));
  if (typeof filters.offset === 'number') params.set('offset', String(filters.offset));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/** List enrollments (admin auth required). */
export async function fetchEnrollments(
  token: string,
  filters: EnrollmentFilters = {}
): Promise<EnrollmentListResponse> {
  const res = await fetch(`${API_BASE}${buildQuery(filters)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch enrollments');
  }
  return res.json();
}

/** Patch enrollment status/notes (admin auth required). */
export async function updateEnrollment(
  token: string,
  id: string,
  patch: { status?: EnrollmentStatus; notes?: string }
): Promise<AdminEnrollment> {
  const res = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update enrollment');
  }
  const json = await res.json();
  return json.enrollment;
}

/**
 * Download a CSV export of enrollments matching the current filters.
 * Triggers a browser download and resolves when done.
 */
export async function downloadEnrollmentsCsv(
  token: string,
  filters: EnrollmentFilters = {}
): Promise<void> {
  const params = new URLSearchParams(buildQuery(filters).replace(/^\?/, ''));
  params.set('format', 'csv');
  const res = await fetch(`${API_BASE}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Export failed');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // Prefer filename suggested by server (Content-Disposition)
  const cd = res.headers.get('content-disposition') || '';
  const match = /filename="([^"]+)"/.exec(cd);
  a.download = match?.[1] || `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Download an XLSX export of enrollments matching the current filters.
 * Fetches all matching enrollments (no pagination) and builds the workbook client-side.
 */
export async function downloadEnrollmentsXlsx(
  token: string,
  filters: EnrollmentFilters = {}
): Promise<void> {
  const { utils, writeFile } = await import('xlsx');

  // Fetch ALL matching enrollments (remove pagination)
  const allFilters = { ...filters };
  delete allFilters.limit;
  delete allFilters.offset;
  const res = await fetchEnrollments(token, { ...allFilters, limit: 10000, offset: 0 });

  const rows = res.enrollments.map((e) => ({
    'Created': e.created_at ? new Date(e.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '',
    'Name': e.full_name,
    'Email': e.email,
    'Phone': e.phone,
    'Program': e.program_title,
    'Level': e.program_level || '',
    'Type': e.program_type,
    'Amount (INR)': (e.amount_inr || 0) / 100,
    'Status': e.status,
    'Payment ID': e.razorpay_payment_id || '',
    'Order ID': e.razorpay_order_id || '',
    'Enrollment ID': e.id,
    'Paid At': e.paid_at ? new Date(e.paid_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '',
    'Failure Reason': e.failure_reason || '',
  }));

  const ws = utils.json_to_sheet(rows);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Enrollments');

  // Auto-size columns
  if (rows.length > 0) {
    ws['!cols'] = Object.keys(rows[0]).map((key) => ({
      wch: Math.min(40, Math.max(key.length + 2, ...rows.map((r) => String((r as Record<string, unknown>)[key] ?? '').length)) + 2),
    }));
  }

  writeFile(wb, `enrollments-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/** Format paise as INR display. */
export function formatINR(paise: number): string {
  const rupees = (paise || 0) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}
