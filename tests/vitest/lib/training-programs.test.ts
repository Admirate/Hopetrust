import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('training-programs module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTrainingPrograms', () => {
    it('returns training programs on success', async () => {
      const { fetchTrainingPrograms } = await import('@/lib/training-programs');
      const mockPrograms = [
        { id: '1', title: 'Internship', category: 'internship' },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ programs: mockPrograms }),
      });

      const result = await fetchTrainingPrograms();
      expect(result).toEqual(mockPrograms);
    });

    it('throws on failure', async () => {
      const { fetchTrainingPrograms } = await import('@/lib/training-programs');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      await expect(fetchTrainingPrograms()).rejects.toThrow('Failed to fetch training programs');
    });
  });

  describe('createTrainingProgram', () => {
    it('sends POST with auth token', async () => {
      const { createTrainingProgram } = await import('@/lib/training-programs');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ program: { id: 'new-id', title: 'New Internship' } }),
      });

      const result = await createTrainingProgram('jwt-token', {
        category: 'internship',
        title: 'New Internship',
        description: 'Desc',
        levels: [],
        duration: '3 months',
        fee: 'INR 5000',
        format: 'Online',
        display_order: 1,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/.netlify/functions/admin-training-programs',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer jwt-token',
          }),
        })
      );
      expect(result.title).toBe('New Internship');
    });

    it('throws UnauthorizedError on 401', async () => {
      const { createTrainingProgram, UnauthorizedError } = await import('@/lib/training-programs');
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });

      await expect(createTrainingProgram('bad-token', {
        category: 'internship',
        title: 'Test',
        description: '',
        levels: [],
        duration: '',
        fee: '',
        format: '',
        display_order: 0,
      })).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('deleteTrainingProgram', () => {
    it('sends DELETE with auth token', async () => {
      const { deleteTrainingProgram } = await import('@/lib/training-programs');
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

      await deleteTrainingProgram('jwt-token', 'program-id');

      expect(mockFetch).toHaveBeenCalledWith(
        '/.netlify/functions/admin-training-programs?id=program-id',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({ Authorization: 'Bearer jwt-token' }),
        })
      );
    });
  });
});
