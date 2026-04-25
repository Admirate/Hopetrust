import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook-secret-test';

const mockUpdateEq = vi.fn(() => Promise.resolve({ error: null }));
const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }));
const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockInsert = vi.fn(() => Promise.resolve());
const mockFrom = vi.fn((table: string) => {
  if (table === 'admin_audit_log') return { insert: mockInsert };
  return { select: mockSelect, update: mockUpdate };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: mockFrom }),
}));

vi.mock('../../../netlify/functions/_shared/razorpay.mjs', () => ({
  verifyWebhookSignature: vi.fn(() => true),
}));

vi.mock('../../../netlify/functions/_shared/emails.mjs', () => ({
  buildEnrollmentConfirmationEmail: vi.fn(() => ({ subject: 'Confirmed', html: '<p>Confirmed</p>' })),
  buildAdminAlertEmail: vi.fn(() => ({ subject: 'Alert', html: '<p>Alert</p>' })),
  sendEmail: vi.fn(() => Promise.resolve({ ok: true })),
}));

let handler: (req: Request) => Promise<Response>;
let verifyWebhookSignature: ReturnType<typeof vi.fn>;

beforeAll(async () => {
  const mod = await import('../../../netlify/functions/razorpay-webhook.mjs');
  handler = mod.default;
  const razorpayMod = await import('../../../netlify/functions/_shared/razorpay.mjs');
  verifyWebhookSignature = razorpayMod.verifyWebhookSignature as ReturnType<typeof vi.fn>;
});

function makeWebhookRequest(eventType: string, paymentData: Record<string, unknown> = {}) {
  const body = {
    event: eventType,
    payload: {
      payment: {
        entity: {
          id: 'pay_test123',
          order_id: 'order_test123',
          amount: 600000,
          currency: 'INR',
          email: 'john@test.com',
          contact: '9876543210',
          method: 'card',
          ...paymentData,
        },
      },
    },
  };
  const bodyStr = JSON.stringify(body);
  return {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json',
      'x-razorpay-signature': 'mock-signature',
    }),
    text: () => Promise.resolve(bodyStr),
  } as unknown as Request;
}

describe('razorpay-webhook function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects non-POST requests', async () => {
    const req = {
      method: 'GET',
      headers: new Headers({}),
    } as unknown as Request;
    const res = await handler(req);
    expect(res.status).toBe(405);
  });

  it('rejects invalid signature when verification fails', async () => {
    verifyWebhookSignature.mockReturnValueOnce(false);
    const res = await handler(makeWebhookRequest('payment.captured'));
    expect(res.status).toBe(400);
    const body = await res.text();
    expect(body).toMatch(/invalid signature/i);
  });

  it('processes payment.captured event', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'enr-1',
        status: 'created',
        email: 'john@test.com',
        full_name: 'John Doe',
        program_title: 'Test',
        program_type: 'addiction',
        program_level: null,
        amount_inr: 600000,
        phone: '9876543210',
        razorpay_payment_id: null,
        metadata: {},
      },
      error: null,
    });

    const res = await handler(makeWebhookRequest('payment.captured'));
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('handles already-paid enrollment (idempotency)', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'enr-1',
        status: 'paid',
        email: 'john@test.com',
        full_name: 'John Doe',
        razorpay_payment_id: 'pay_test123',
        metadata: {},
      },
      error: null,
    });

    const res = await handler(makeWebhookRequest('payment.captured'));
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/already processed/i);
  });

  it('processes payment.failed event', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'enr-1',
        status: 'created',
        email: 'john@test.com',
        full_name: 'John Doe',
        metadata: {},
      },
      error: null,
    });

    const res = await handler(makeWebhookRequest('payment.failed', {
      error_code: 'BAD_REQUEST_ERROR',
      error_description: 'Payment failed',
      error_source: 'bank',
      error_step: 'payment_authorization',
      error_reason: 'payment_failed',
    }));
    expect(res.status).toBe(200);
  });

  it('ignores events without payment entity', async () => {
    const body = JSON.stringify({ event: 'order.paid', payload: {} });
    const req = {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'x-razorpay-signature': 'mock-signature',
      }),
      text: () => Promise.resolve(body),
    } as unknown as Request;
    const res = await handler(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toMatch(/ignored/i);
  });
});
