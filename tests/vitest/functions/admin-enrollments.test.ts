import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.ADMIN_JWT_SECRET = 'test-jwt-secret-32chars-long!!';

const mockData = [
  { id: 'enr-1', status: 'paid', full_name: 'John Doe', email: 'john@test.com', created_at: '2026-04-25T00:00:00Z' },
];

const mockRange = vi.fn(() => Promise.resolve({ data: mockData, error: null, count: 1 }));
const mockOrder = vi.fn(() => ({ range: mockRange }));
const mockStar = vi.fn(() => ({ order: mockOrder }));
const mockInsert = vi.fn(() => Promise.resolve());
const mockFrom = vi.fn((table: string) => {
  if (table === 'admin_audit_log') return { insert: mockInsert };
  return { select: mockStar };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: mockFrom }),
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn((token: string) => {
      if (token === 'valid-token') return { sub: 'user-1', email: 'admin@test.com', role: 'admin' };
      throw new Error('invalid');
    }),
  },
}));

let handler: (req: Request) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('../../../netlify/functions/admin-enrollments.mjs');
  handler = mod.default;
});

function makeRequest(method: string, params = '', body?: Record<string, unknown>, token = 'valid-token') {
  const url = `https://example.com/.netlify/functions/admin-enrollments${params ? '?' + params : ''}`;
  return {
    method,
    url,
    headers: new Headers({
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    }),
    json: () => Promise.resolve(body || {}),
  } as unknown as Request;
}

describe('admin-enrollments function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects unauthenticated requests', async () => {
    const res = await handler(makeRequest('GET', '', undefined, 'bad-token'));
    expect(res.status).toBe(401);
  });

  it('handles CORS preflight', async () => {
    const req = {
      method: 'OPTIONS',
      url: 'https://example.com/.netlify/functions/admin-enrollments',
      headers: new Headers({}),
    } as unknown as Request;
    const res = await handler(req);
    expect(res.status).toBe(204);
  });

  it('returns enrollments list on GET', async () => {
    const res = await handler(makeRequest('GET'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.enrollments).toBeDefined();
  });

  it('rejects unsupported methods', async () => {
    const res = await handler(makeRequest('DELETE'));
    expect(res.status).toBe(405);
  });

  it('rejects PATCH without valid id', async () => {
    const res = await handler(makeRequest('PATCH', 'id=not-a-uuid', { status: 'paid' }));
    expect(res.status).toBe(400);
  });

  it('rejects PATCH with invalid status', async () => {
    const res = await handler(makeRequest('PATCH', 'id=550e8400-e29b-41d4-a716-446655440000', { status: 'invalid' }));
    expect(res.status).toBe(400);
  });

  it('rejects PATCH with no supported fields', async () => {
    const res = await handler(makeRequest('PATCH', 'id=550e8400-e29b-41d4-a716-446655440000', { foo: 'bar' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/no supported fields/i);
  });
});
