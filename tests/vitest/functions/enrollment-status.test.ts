import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Set env vars BEFORE module import
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: mockFrom }),
}));

let handler: (req: Request) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('../../../netlify/functions/enrollment-status.mjs');
  handler = mod.default;
});

function makeRequest(id: string) {
  const url = id
    ? `https://example.com/.netlify/functions/enrollment-status?id=${id}`
    : 'https://example.com/.netlify/functions/enrollment-status';
  return {
    method: 'GET',
    url,
    headers: new Headers({}),
  } as unknown as Request;
}

describe('enrollment-status function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns enrollment data for valid UUID', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'paid',
        program_title: 'Inpatient Treatment',
        program_level: null,
        amount_inr: 600000,
        paid_at: '2026-04-25T00:00:00Z',
      },
      error: null,
    });

    const res = await handler(makeRequest('550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('paid');
    expect(body.program_title).toBe('Inpatient Treatment');
  });

  it('rejects missing id parameter', async () => {
    const res = await handler(makeRequest(''));
    expect(res.status).toBe(400);
  });

  it('rejects invalid UUID format', async () => {
    const res = await handler(makeRequest('not-a-uuid'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/id/i);
  });

  it('returns 404 when enrollment not found', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: null });

    const res = await handler(makeRequest('550e8400-e29b-41d4-a716-446655440000'));
    expect(res.status).toBe(404);
  });

  it('handles CORS preflight', async () => {
    const req = {
      method: 'OPTIONS',
      url: 'https://example.com/.netlify/functions/enrollment-status',
      headers: new Headers({}),
    } as unknown as Request;
    const res = await handler(req);
    expect(res.status).toBe(204);
  });
});
