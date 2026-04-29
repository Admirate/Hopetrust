'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  AlertTriangle,
  Mail,
  Phone,
  ClipboardCopy,
  Check,
  ChevronDown,
  FileSpreadsheet,
} from 'lucide-react';
import {
  fetchEnrollments,
  updateEnrollment,
  downloadEnrollmentsCsv,
  downloadEnrollmentsXlsx,
  formatINR,
  UnauthorizedError,
  type AdminEnrollment,
  type EnrollmentFilters,
  type EnrollmentStatus,
  type ProgramType,
} from '@/lib/enrollments-admin';

const PAGE_SIZE = 25;
const POLL_REFRESH_MS = 30_000; // auto-refresh every 30s when visible

const STATUS_META: Record<EnrollmentStatus, { label: string; bg: string; text: string }> = {
  paid: { label: 'Paid', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  created: { label: 'Awaiting', bg: 'bg-amber-100', text: 'text-amber-800' },
  failed: { label: 'Failed', bg: 'bg-red-100', text: 'text-red-800' },
  abandoned: { label: 'Abandoned', bg: 'bg-gray-100', text: 'text-gray-700' },
};

export interface EnrollmentsTabProps {
  token: string;
  onUnauthorized: () => void;
  /** Called when row count changes so the parent can show a badge in the tab header. */
  onCountChange?: (count: number) => void;
}

export default function EnrollmentsTab({ token, onUnauthorized, onCountChange }: EnrollmentsTabProps) {
  const [filters, setFilters] = useState<EnrollmentFilters>({
    status: '',
    program_type: '',
    from: '',
    to: '',
    q: '',
  });
  const [page, setPage] = useState(0); // 0-indexed
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<AdminEnrollment | null>(null);

  // Debounced search query to avoid hammering the API while typing
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, q: searchInput.trim() || undefined }));
      setPage(0);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const effectiveFilters = useMemo<EnrollmentFilters>(
    () => ({
      ...filters,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [filters, page]
  );

  const load = useCallback(
    async (opts: { silent?: boolean } = {}) => {
      if (opts.silent) setRefreshing(true);
      else setLoading(true);
      setError('');
      try {
        const res = await fetchEnrollments(token, effectiveFilters);
        setEnrollments(res.enrollments);
        setTotal(res.total);
        onCountChange?.(res.total);
      } catch (e) {
        if (e instanceof UnauthorizedError) { onUnauthorized(); return; }
        setError(e instanceof Error ? e.message : 'Failed to load enrollments');
      } finally {
        if (opts.silent) setRefreshing(false);
        else setLoading(false);
      }
    },
    [token, effectiveFilters, onUnauthorized, onCountChange]
  );

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [effectiveFilters]);

  // Auto-refresh silently when tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') load({ silent: true });
    }, POLL_REFRESH_MS);
    return () => clearInterval(interval);
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function handleExport(format: 'csv' | 'xlsx') {
    setShowExportMenu(false);
    setExporting(true);
    setError('');
    try {
      if (format === 'xlsx') {
        await downloadEnrollmentsXlsx(token, filters);
      } else {
        await downloadEnrollmentsCsv(token, filters);
      }
    } catch (e) {
      if (e instanceof UnauthorizedError) { onUnauthorized(); return; }
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      {/* Heading bar */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-[#00373E] to-[#024a53] p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-white sm:text-lg">Enrollments</h2>
          <p className="text-xs text-white/60 sm:text-sm">
            {total.toLocaleString()} total · auto-refreshes every 30s
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            onClick={() => load({ silent: true })}
            disabled={refreshing}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-60 sm:flex-initial sm:px-4 sm:text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu((v) => !v)}
              disabled={exporting || total === 0}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ED7428] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#ED7428]/20 transition hover:bg-[#d4651f] disabled:opacity-60 sm:flex-initial sm:px-4 sm:text-sm"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export Data
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#00373E] transition hover:bg-[#F7F6F4]"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('xlsx')}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#00373E] transition hover:bg-[#F7F6F4]"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                    Export as XLSX
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-5 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
        {/* Search — spans 2 on desktop */}
        <div className="sm:col-span-2 lg:col-span-2">
          <FilterLabel htmlFor="enr-search">Search</FilterLabel>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="enr-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Name, email, phone, payment ID…"
              className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <FilterLabel htmlFor="enr-status">Status</FilterLabel>
          <select
            id="enr-status"
            value={filters.status || ''}
            onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value as EnrollmentStatus | '' })); setPage(0); }}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
          >
            <option value="">All statuses</option>
            <option value="paid">Paid</option>
            <option value="created">Awaiting</option>
            <option value="failed">Failed</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        {/* Program type */}
        <div>
          <FilterLabel htmlFor="enr-type">Program type</FilterLabel>
          <select
            id="enr-type"
            value={filters.program_type || ''}
            onChange={(e) => { setFilters((f) => ({ ...f, program_type: e.target.value as ProgramType | '' })); setPage(0); }}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
          >
            <option value="">All programs</option>
            <option value="training">Training</option>
            <option value="addiction">Addiction</option>
          </select>
        </div>

        {/* From date */}
        <div>
          <FilterLabel htmlFor="enr-from">From date</FilterLabel>
          <input
            id="enr-from"
            type="date"
            value={filters.from || ''}
            max={filters.to || undefined}
            onChange={(e) => { setFilters((f) => ({ ...f, from: e.target.value || undefined })); setPage(0); }}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
          />
        </div>

        {/* To date */}
        <div>
          <FilterLabel htmlFor="enr-to">To date</FilterLabel>
          <input
            id="enr-to"
            type="date"
            value={filters.to || ''}
            min={filters.from || undefined}
            onChange={(e) => { setFilters((f) => ({ ...f, to: e.target.value || undefined })); setPage(0); }}
            className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
          />
        </div>

        {/* Clear filters — only shown if any filter is active */}
        {(filters.status || filters.program_type || filters.from || filters.to || searchInput) && (
          <div className="sm:col-span-2 lg:col-span-6">
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setFilters({ status: '', program_type: '', from: '', to: '', q: '' });
                setPage(0);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-[#00373E]"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#ED7428]" />
            <p className="mt-3 text-sm text-gray-400">Loading enrollments…</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-[#00373E]">No enrollments found</p>
            <p className="mt-1 text-sm text-gray-400">Try adjusting the filters or date range</p>
          </div>
        ) : (
          <>
            {/* Desktop / tablet: full table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-[#F7F6F4] text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="hidden px-4 py-3 lg:table-cell">Type</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-[#F7F6F4]/40">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                        {formatDateTime(e.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#00373E]">{e.full_name}</div>
                        <div className="text-xs text-gray-500">{e.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[#00373E]">{e.program_title}</div>
                        {e.program_level && (
                          <div className="text-xs text-gray-500">{e.program_level}</div>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700">
                          {e.program_type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#00373E]">
                        {formatINR(e.amount_inr)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(e)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#00373E] transition hover:bg-gray-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: card list */}
            <ul className="divide-y divide-gray-100 md:hidden">
              {enrollments.map((e) => (
                <li key={e.id} className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSelected(e)}
                    className="flex w-full flex-col gap-2 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-[#00373E]">{e.full_name}</p>
                        <p className="truncate text-xs text-gray-500">{e.email}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-semibold text-[#00373E]">{formatINR(e.amount_inr)}</p>
                        <div className="mt-1 flex justify-end">
                          <StatusBadge status={e.status} />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-[#00373E]">{e.program_title}</p>
                      {e.program_level && (
                        <p className="truncate text-xs text-gray-500">{e.program_level}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="capitalize">{e.program_type}</span>
                      <span>{formatDateTime(e.created_at)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row">
              <span className="text-xs sm:text-sm">
                Showing <strong>{page * PAGE_SIZE + 1}</strong>–
                <strong>{Math.min((page + 1) * PAGE_SIZE, total)}</strong> of <strong>{total}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#00373E] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <span className="px-2 text-xs">
                  Page {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page + 1 >= totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#00373E] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <EnrollmentDetailDrawer
          enrollment={selected}
          token={token}
          onClose={() => setSelected(null)}
          onUnauthorized={onUnauthorized}
          onUpdated={(updated) => {
            setEnrollments((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setSelected(updated);
          }}
        />
      )}
    </div>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.bg} ${meta.text}`}>
      {meta.label}
    </span>
  );
}

// ─── Detail drawer ───────────────────────────────────────────────────────────

function EnrollmentDetailDrawer({
  enrollment,
  token,
  onClose,
  onUpdated,
  onUnauthorized,
}: {
  enrollment: AdminEnrollment;
  token: string;
  onClose: () => void;
  onUpdated: (e: AdminEnrollment) => void;
  onUnauthorized: () => void;
}) {
  const [status, setStatus] = useState<EnrollmentStatus>(enrollment.status);
  const existingNotes =
    typeof enrollment.metadata?.admin_notes === 'string'
      ? (enrollment.metadata.admin_notes as string)
      : '';
  const [notes, setNotes] = useState(existingNotes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Lock body scroll + close on Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handler);
    };
  }, [saving, onClose]);

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      const patch: { status?: EnrollmentStatus; notes?: string } = {};
      if (status !== enrollment.status) patch.status = status;
      if (notes !== existingNotes) patch.notes = notes;
      if (Object.keys(patch).length === 0) {
        onClose();
        return;
      }
      const updated = await updateEnrollment(token, enrollment.id, patch);
      onUpdated(updated);
    } catch (e) {
      if (e instanceof UnauthorizedError) { onUnauthorized(); return; }
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function copy(value: string, key: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    });
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-stretch justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrollment-drawer-title"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <div className="relative w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#00373E] px-6 py-5 text-white">
          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ED7428]">
            Enrollment
          </p>
          <h3 id="enrollment-drawer-title" className="mt-1 text-lg font-semibold leading-tight pr-8">
            {enrollment.program_title}
          </h3>
          {enrollment.program_level && (
            <p className="mt-1 text-sm text-white/80">{enrollment.program_level}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={enrollment.status} />
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">
              {formatINR(enrollment.amount_inr)}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium capitalize text-white">
              {enrollment.program_type}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">
          {/* Customer */}
          <section>
            <SectionTitle>Customer</SectionTitle>
            <div className="mt-2 space-y-1 text-sm text-[#00373E]">
              <div className="font-semibold">{enrollment.full_name}</div>
              <a href={`mailto:${enrollment.email}`} className="flex items-center gap-2 text-[#486364] hover:text-[#00373E]">
                <Mail className="h-3.5 w-3.5" />
                {enrollment.email}
              </a>
              <a href={`tel:${enrollment.phone}`} className="flex items-center gap-2 text-[#486364] hover:text-[#00373E]">
                <Phone className="h-3.5 w-3.5" />
                {enrollment.phone}
              </a>
            </div>
          </section>

          {/* Payment */}
          <section>
            <SectionTitle>Payment</SectionTitle>
            <dl className="mt-2 space-y-2 text-sm">
              <DetailRow label="Order ID">
                <CopyValue value={enrollment.razorpay_order_id} copied={copied === 'order'} onCopy={(v) => copy(v, 'order')} />
              </DetailRow>
              <DetailRow label="Payment ID">
                <CopyValue value={enrollment.razorpay_payment_id} copied={copied === 'pay'} onCopy={(v) => copy(v, 'pay')} />
              </DetailRow>
              <DetailRow label="Enrollment ID">
                <CopyValue value={enrollment.id} copied={copied === 'enr'} onCopy={(v) => copy(v, 'enr')} />
              </DetailRow>
              <DetailRow label="Created">{formatDateTime(enrollment.created_at)}</DetailRow>
              {enrollment.paid_at && <DetailRow label="Paid at">{formatDateTime(enrollment.paid_at)}</DetailRow>}
              {enrollment.failure_reason && (
                <DetailRow label="Failure">
                  <span className="text-red-700">{enrollment.failure_reason}</span>
                </DetailRow>
              )}
            </dl>
          </section>

          {/* Admin controls */}
          <section>
            <SectionTitle>Admin actions</SectionTitle>
            <div className="mt-2 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EnrollmentStatus)}
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
                >
                  <option value="created">Awaiting</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="abandoned">Abandoned</option>
                </select>
                <p className="mt-1 text-[11px] text-gray-500">
                  Only change this for manual reconciliation — the webhook normally handles it.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Internal notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={saving}
                  maxLength={2000}
                  rows={3}
                  placeholder="Not visible to the customer"
                  className="w-full rounded-xl border border-gray-200 bg-[#F7F6F4]/50 px-3 py-2.5 text-sm outline-none transition focus:border-[#ED7428] focus:bg-white focus:ring-2 focus:ring-[#ED7428]/20"
                />
                <p className="mt-1 text-[11px] text-gray-500">{notes.length}/2000</p>
              </div>
            </div>
          </section>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-gray-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#00373E] transition hover:bg-gray-50 disabled:opacity-60"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={saving || (status === enrollment.status && notes === existingNotes)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ED7428] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#ED7428]/20 transition hover:bg-[#d4651f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-gray-500"
    >
      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">{children}</h4>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-xs text-gray-500">{label}</dt>
      <dd className="min-w-0 flex-1 break-all text-right text-[13px] text-[#00373E]">{children}</dd>
    </div>
  );
}

function CopyValue({
  value,
  copied,
  onCopy,
}: {
  value: string | null;
  copied: boolean;
  onCopy: (v: string) => void;
}) {
  if (!value) return <span className="text-gray-400">—</span>;
  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      className="inline-flex items-center gap-1 font-mono text-[12px] text-[#00373E] transition hover:text-[#ED7428]"
      title="Click to copy"
    >
      <span className="break-all">{value}</span>
      {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <ClipboardCopy className="h-3 w-3 text-gray-400" />}
    </button>
  );
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }).format(d);
  } catch {
    return iso;
  }
}
