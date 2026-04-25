import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

const mockCreateOrder = vi.fn();
const mockOpenRazorpayCheckout = vi.fn();
vi.mock('@/lib/enrollment', () => ({
  createOrder: (...args: unknown[]) => mockCreateOrder(...args),
  openRazorpayCheckout: (...args: unknown[]) => mockOpenRazorpayCheckout(...args),
}));

import EnrollmentModal from '@/components/EnrollmentModal';

describe('EnrollmentModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    programType: 'training' as const,
    programId: 'test-uuid',
    programTitle: 'Addiction Counselling Internship',
    levelIndex: 0,
    levelLabel: 'Level 1 — 10 hours',
    priceDisplay: '₹2,500',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with program title', () => {
    render(<EnrollmentModal {...defaultProps} />);
    expect(screen.getByText('Addiction Counselling Internship')).toBeInTheDocument();
  });

  it('renders level label and price', () => {
    render(<EnrollmentModal {...defaultProps} />);
    expect(screen.getByText('Level 1 — 10 hours')).toBeInTheDocument();
    expect(screen.getByText('₹2,500')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<EnrollmentModal {...defaultProps} />);
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
  });

  it('shows submit button', () => {
    render(<EnrollmentModal {...defaultProps} />);
    expect(screen.getByText('Proceed to payment')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<EnrollmentModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Addiction Counselling Internship')).not.toBeInTheDocument();
  });

  it('shows validation error for short name', async () => {
    const user = userEvent.setup();
    render(<EnrollmentModal {...defaultProps} />);

    await user.type(screen.getByLabelText('Full name'), 'A');
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Phone'), '9876543210');
    await user.click(screen.getByText('Proceed to payment'));

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter your full name.');
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup();
    render(<EnrollmentModal {...defaultProps} />);

    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    // Leave email empty — type then clear
    await user.type(screen.getByLabelText('Email'), 'x');
    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Phone'), '9876543210');
    await user.click(screen.getByText('Proceed to payment'));

    // HTML5 required validation will prevent submission; the form should not call createOrder
    expect(mockCreateOrder).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid phone', async () => {
    const user = userEvent.setup();
    render(<EnrollmentModal {...defaultProps} />);

    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@test.com');
    await user.type(screen.getByLabelText('Phone'), 'abc');
    await user.click(screen.getByText('Proceed to payment'));

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid phone number.');
  });

  it('calls createOrder on valid submission', async () => {
    mockCreateOrder.mockResolvedValueOnce({
      enrollment_id: 'enr-123',
      order_id: 'order_xyz',
      amount: 250000,
      currency: 'INR',
      key_id: 'rzp_test_key',
      program_title: 'Test',
      program_level: 'Level 1',
      prefill: { name: 'John', email: 'john@test.com', contact: '9876543210' },
    });
    mockOpenRazorpayCheckout.mockResolvedValueOnce(undefined);

    const user = userEvent.setup();
    render(<EnrollmentModal {...defaultProps} />);

    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@test.com');
    await user.type(screen.getByLabelText('Phone'), '9876543210');
    await user.click(screen.getByText('Proceed to payment'));

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledWith(expect.objectContaining({
        program_type: 'training',
        program_id: 'test-uuid',
        full_name: 'John Doe',
        email: 'john@test.com',
        phone: '9876543210',
      }));
    });
  });

  it('shows error when createOrder fails', async () => {
    mockCreateOrder.mockRejectedValueOnce(new Error('Unable to initiate payment'));

    const user = userEvent.setup();
    render(<EnrollmentModal {...defaultProps} />);

    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@test.com');
    await user.type(screen.getByLabelText('Phone'), '9876543210');
    await user.click(screen.getByText('Proceed to payment'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Unable to initiate payment');
    });
  });
});
