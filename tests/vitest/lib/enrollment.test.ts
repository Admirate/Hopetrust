import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatINR } from '@/lib/enrollment';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('enrollment module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatINR', () => {
    it('formats paise to INR', () => {
      expect(formatINR(250000)).toBe('₹2,500');
    });

    it('formats zero paise', () => {
      expect(formatINR(0)).toBe('₹0');
    });

    it('formats large amounts', () => {
      expect(formatINR(1700000)).toBe('₹17,000');
    });

    it('handles undefined-like input', () => {
      expect(formatINR(undefined as unknown as number)).toBe('₹0');
    });
  });

  describe('createOrder', () => {
    it('calls the create-order endpoint with correct payload', async () => {
      const { createOrder } = await import('@/lib/enrollment');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          enrollment_id: 'test-uuid',
          order_id: 'order_test123',
          amount: 250000,
          currency: 'INR',
          key_id: 'rzp_test_key',
          program_title: 'Test Program',
          program_level: null,
          prefill: { name: 'John', email: 'john@test.com', contact: '9876543210' },
        }),
      });

      const result = await createOrder({
        program_type: 'training',
        program_id: 'some-uuid',
        full_name: 'John Doe',
        email: 'john@test.com',
        phone: '9876543210',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/.netlify/functions/create-order',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.enrollment_id).toBe('test-uuid');
      expect(result.order_id).toBe('order_test123');
    });

    it('throws on non-ok response', async () => {
      const { createOrder } = await import('@/lib/enrollment');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'Too many requests' }),
      });

      await expect(createOrder({
        program_type: 'training',
        program_id: 'some-uuid',
        full_name: 'John',
        email: 'john@test.com',
        phone: '9876543210',
      })).rejects.toThrow('Too many requests');
    });
  });

  describe('fetchEnrollmentStatus', () => {
    it('fetches enrollment by ID', async () => {
      const { fetchEnrollmentStatus } = await import('@/lib/enrollment');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: 'test-uuid',
          status: 'paid',
          program_title: 'Test Program',
          program_level: null,
          amount_inr: 250000,
          paid_at: '2026-04-25T00:00:00Z',
        }),
      });

      const result = await fetchEnrollmentStatus('test-uuid');
      expect(result.status).toBe('paid');
      expect(result.id).toBe('test-uuid');
      expect(mockFetch).toHaveBeenCalledWith(
        '/.netlify/functions/enrollment-status?id=test-uuid',
        expect.objectContaining({ cache: 'no-store' })
      );
    });

    it('throws on 404', async () => {
      const { fetchEnrollmentStatus } = await import('@/lib/enrollment');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      await expect(fetchEnrollmentStatus('missing-uuid')).rejects.toThrow('Not found');
    });
  });
});
