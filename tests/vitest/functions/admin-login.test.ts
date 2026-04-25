import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Set env vars BEFORE module import
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.ADMIN_JWT_SECRET = 'test-jwt-secret-32chars-long!!';

const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockUpdate = vi.fn(() => ({ eq: vi.fn() }));
const mockInsert = vi.fn(() => Promise.resolve());
const mockFrom = vi.fn((table: string) => {
  if (table === 'admin_audit_log') return { insert: mockInsert };
  return { select: mockSelect, update: mockUpdate };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: mockFrom }),
}));

vi.mock('bcryptjs', () => ({
  default: { compare: vi.fn() },
}));

vi.mock('jsonwebtoken', () => ({
  default: { sign: vi.fn(() => 'mock-jwt-token') },
}));

import bcrypt from 'bcryptjs';

let handler: (req: Request) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('../../../netlify/functions/admin-login.mjs');
  handler = mod.default;
});

function makeRequest(body: Record<string, unknown>, method = 'POST') {
  return {
    method,
    headers: new Headers({
      'content-type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
    }),
    json: () => Promise.resolve(body),
  } as unknown as Request;
}

describe('admin-login function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects non-POST methods', async () => {
    const req = makeRequest({}, 'GET');
    const res = await handler(req);
    expect(res.status).toBe(405);
  });

  it('handles CORS preflight', async () => {
    const req = makeRequest({}, 'OPTIONS');
    const res = await handler(req);
    expect(res.status).toBe(204);
  });

  it('rejects missing email or password', async () => {
    const res = await handler(makeRequest({ email: '' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Email and password are required');
  });

  it('rejects when user not found', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'not found' } });
    const res = await handler(makeRequest({ email: 'bad@test.com', password: 'pass123' }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Invalid credentials');
  });

  it('rejects wrong password and increments failed attempts', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'user-1',
        email: 'admin@test.com',
        password_hash: '$2a$10$hashedvalue',
        failed_attempts: 0,
        locked_until: null,
      },
      error: null,
    });
    (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false);

    const res = await handler(makeRequest({ email: 'admin@test.com', password: 'wrong' }));
    expect(res.status).toBe(401);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('returns JWT on valid credentials', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'user-1',
        email: 'admin@test.com',
        password_hash: '$2a$10$hashedvalue',
        failed_attempts: 0,
        locked_until: null,
      },
      error: null,
    });
    (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

    const res = await handler(makeRequest({ email: 'admin@test.com', password: 'correct' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.token).toBe('mock-jwt-token');
    expect(body.email).toBe('admin@test.com');
  });

  it('locks account after 5 failed attempts', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'user-1',
        email: 'admin@test.com',
        password_hash: '$2a$10$hashedvalue',
        failed_attempts: 4,
        locked_until: null,
      },
      error: null,
    });
    (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false);

    const res = await handler(makeRequest({ email: 'admin@test.com', password: 'wrong' }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.locked).toBe(true);
  });

  it('rejects locked account', async () => {
    const futureDate = new Date(Date.now() + 600000).toISOString();
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'user-1',
        email: 'admin@test.com',
        password_hash: '$2a$10$hashedvalue',
        failed_attempts: 5,
        locked_until: futureDate,
      },
      error: null,
    });

    const res = await handler(makeRequest({ email: 'admin@test.com', password: 'correct' }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.locked).toBe(true);
    expect(body.retryAfter).toBeGreaterThan(0);
  });

  it('rejects non-JSON content type', async () => {
    const req = {
      method: 'POST',
      headers: new Headers({ 'content-type': 'text/plain' }),
      json: () => Promise.resolve({}),
    } as unknown as Request;
    const res = await handler(req);
    expect(res.status).toBe(415);
  });

  it('rejects overly long email', async () => {
    const longEmail = 'a'.repeat(201) + '@test.com';
    const res = await handler(makeRequest({ email: longEmail, password: 'pass' }));
    expect(res.status).toBe(401);
  });
});
