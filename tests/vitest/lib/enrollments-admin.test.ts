import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatINR } from '@/lib/enrollments-admin';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('enrollments-admin module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatINR', () => {
    it('formats paise to INR', () => {
      expect(formatINR(600000)).toBe('₹6,000');
    });

    it('formats zero', () => {
      expect(formatINR(0)).toBe('₹0');
    });
  });

  describe('fetchEnrollments', () => {
    it('fetches with auth token and filters', async () => {
      const { fetchEnrollments } = await import('@/lib/enrollments-admin');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          enrollments: [{ id: '1', status: 'paid' }],
          total: 1,
          limit: 50,
          offset: 0,
        }),
      });

      const result = await fetchEnrollments('jwt-token', { status: 'paid', limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('status=paid'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer jwt-token',
          }),
        })
      );
      expect(result.enrollments).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('throws UnauthorizedError on 401', async () => {
      const { fetchEnrollments, UnauthorizedError } = await import('@/lib/enrollments-admin');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

      await expect(fetchEnrollments('bad-token')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('updateEnrollment', () => {
    it('sends PATCH with status update', async () => {
      const { updateEnrollment } = await import('@/lib/enrollments-admin');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ enrollment: { id: 'enr-1', status: 'abandoned' } }),
      });

      const result = await updateEnrollment('jwt-token', 'enr-1', { status: 'abandoned' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('id=enr-1'),
        expect.objectContaining({ method: 'PATCH' })
      );
      expect(result.status).toBe('abandoned');
    });

    it('throws UnauthorizedError on 401', async () => {
      const { updateEnrollment, UnauthorizedError } = await import('@/lib/enrollments-admin');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

      await expect(updateEnrollment('bad', 'id', { status: 'failed' }))
        .rejects.toThrow(UnauthorizedError);
    });
  });
});
