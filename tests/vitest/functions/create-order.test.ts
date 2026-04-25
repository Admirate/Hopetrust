import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.RAZORPAY_KEY_ID = 'rzp_test_key';
process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secret';

const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
const mockMaybeSingle = vi.fn(() => Promise.resolve({ data: null }));
const mockLimit = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
const mockOrderBy = vi.fn(() => ({ limit: mockLimit }));
const mockGte3 = vi.fn(() => ({ order: mockOrderBy }));
const mockEqStatus = vi.fn(() => ({ gte: mockGte3 }));
const mockEqProg = vi.fn(() => ({ eq: mockEqStatus }));
const mockEq = vi.fn(() => ({ eq: mockEqProg }));
const mockGte = vi.fn(() => ({ filter: vi.fn(() => Promise.resolve({ count: 0, error: null })) }));
const mockHead = vi.fn(() => ({ gte: mockGte }));
const mockSelect = vi.fn((_sel?: string, opts?: Record<string, unknown>) => {
  if (opts?.head) return mockHead();
  return { eq: mockEq };
});
const mockSingle = vi.fn();

const mockFrom = vi.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: mockFrom }),
}));

vi.mock('../../../netlify/functions/_shared/razorpay.mjs', () => ({
  createRazorpayOrder: vi.fn(() => Promise.resolve({
    id: 'order_test123',
    amount: 600000,
    currency: 'INR',
  })),
}));

let handler: (req: Request) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('../../../netlify/functions/create-order.mjs');
  handler = mod.default;
});

function makeRequest(body: Record<string, unknown>, method = 'POST') {
  return {
    method,
    url: 'https://example.com/.netlify/functions/create-order',
    headers: new Headers({
      'content-type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
    }),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Request;
}

describe('create-order function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects non-POST methods', async () => {
    const res = await handler(makeRequest({}, 'GET'));
    expect(res.status).toBe(405);
  });

  it('handles CORS preflight', async () => {
    const req = {
      method: 'OPTIONS',
      url: 'https://example.com/.netlify/functions/create-order',
      headers: new Headers({}),
    } as unknown as Request;
    const res = await handler(req);
    expect(res.status).toBe(204);
  });

  it('rejects missing required fields', async () => {
    const res = await handler(makeRequest({
      program_type: 'addiction',
      program_id: '550e8400-e29b-41d4-a716-446655440000',
      // missing full_name, email, phone
    }));
    expect(res.status).toBe(400);
  });

  it('rejects invalid program_type', async () => {
    const res = await handler(makeRequest({
      program_type: 'invalid',
      program_id: '550e8400-e29b-41d4-a716-446655440000',
      full_name: 'John Doe',
      email: 'john@test.com',
      phone: '9876543210',
    }));
    expect(res.status).toBe(400);
  });

  it('rejects invalid email format', async () => {
    const res = await handler(makeRequest({
      program_type: 'addiction',
      program_id: '550e8400-e29b-41d4-a716-446655440000',
      full_name: 'John Doe',
      email: 'not-an-email',
      phone: '9876543210',
    }));
    expect(res.status).toBe(400);
  });

  it('rejects invalid UUID for program_id', async () => {
    const res = await handler(makeRequest({
      program_type: 'addiction',
      program_id: 'not-a-uuid',
      full_name: 'John Doe',
      email: 'john@test.com',
      phone: '9876543210',
    }));
    expect(res.status).toBe(400);
  });

  it('rejects overly long input fields', async () => {
    const res = await handler(makeRequest({
      program_type: 'addiction',
      program_id: '550e8400-e29b-41d4-a716-446655440000',
      full_name: 'a'.repeat(300),
      email: 'john@test.com',
      phone: '9876543210',
    }));
    expect(res.status).toBe(400);
  });
});
