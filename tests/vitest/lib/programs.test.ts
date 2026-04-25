import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('programs module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPrograms', () => {
    it('returns programs on success', async () => {
      const { fetchPrograms } = await import('@/lib/programs');
      const mockPrograms = [
        { id: '1', title: 'Inpatient', is_active: true },
        { id: '2', title: 'Outpatient', is_active: true },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ programs: mockPrograms }),
      });

      const result = await fetchPrograms();
      expect(result).toEqual(mockPrograms);
      expect(mockFetch).toHaveBeenCalledWith('/.netlify/functions/admin-programs');
    });

    it('throws on failure', async () => {
      const { fetchPrograms } = await import('@/lib/programs');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(fetchPrograms()).rejects.toThrow('Failed to fetch programs');
    });
  });

  describe('createProgram', () => {
    it('sends POST with auth token', async () => {
      const { createProgram } = await import('@/lib/programs');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ program: { id: 'new-id', title: 'New' } }),
      });

      const result = await createProgram('jwt-token', {
        title: 'New',
        subtitle: '',
        description: 'Desc',
        features: [],
        note: '',
        cost: '5000',
        display_order: 1,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/.netlify/functions/admin-programs',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer jwt-token',
          }),
        })
      );
      expect(result.title).toBe('New');
    });

    it('throws UnauthorizedError on 401', async () => {
      const { createProgram, UnauthorizedError } = await import('@/lib/programs');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

      await expect(createProgram('bad-token', {
        title: 'New',
        subtitle: '',
        description: '',
        features: [],
        note: '',
        cost: '',
        display_order: 0,
      })).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('deleteProgram', () => {
    it('sends DELETE with auth token and id', async () => {
      const { deleteProgram } = await import('@/lib/programs');
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

      await deleteProgram('jwt-token', 'program-id');

      expect(mockFetch).toHaveBeenCalledWith(
        '/.netlify/functions/admin-programs?id=program-id',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: 'Bearer jwt-token',
          }),
        })
      );
    });

    it('throws UnauthorizedError on 401', async () => {
      const { deleteProgram, UnauthorizedError } = await import('@/lib/programs');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

      await expect(deleteProgram('bad-token', 'id')).rejects.toThrow(UnauthorizedError);
    });
  });
});
