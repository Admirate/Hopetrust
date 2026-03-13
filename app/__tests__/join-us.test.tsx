import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  usePathname: () => '/join-us',
}));

vi.mock('next/image', () => ({
  default: ({ fill, priority, ...rest }: Record<string, unknown>) => {
    return <img {...rest} data-fill={fill ? 'true' : undefined} />;
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string } & Record<string, unknown>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/font/google', () => ({
  Bricolage_Grotesque: () => ({ className: 'mock-font' }),
  Inter: () => ({ className: 'mock-font' }),
}));

vi.mock('next/dynamic', () => ({
  default: () => {
    const DummyComponent = () => <div data-testid="dynamic-component" />;
    return DummyComponent;
  },
}));

vi.mock('@/lib/assets', () => ({
  getAssetUrl: (path: string) => `/mock/${path}`,
}));

const mockInsert = vi.fn();
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      insert: mockInsert,
    }),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

import JoinUsPage from '../join-us/page';
import { toast } from 'sonner';

describe('JoinUsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
  });

  it('renders the join us form', () => {
    render(<JoinUsPage />);
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://linkedin.com/in/...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tell us why you'd like to join Hope Trust...")).toBeInTheDocument();
  });

  it('renders the perks section', () => {
    render(<JoinUsPage />);
    expect(screen.getByText('Expert Team')).toBeInTheDocument();
    expect(screen.getByText('Purpose Driven')).toBeInTheDocument();
    expect(screen.getByText('Growth Culture')).toBeInTheDocument();
  });

  it('renders position select with all options', () => {
    render(<JoinUsPage />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Select a role')).toBeInTheDocument();
    expect(screen.getByText('Psychologist / Therapist')).toBeInTheDocument();
    expect(screen.getByText('Psychiatrist')).toBeInTheDocument();
    expect(screen.getByText('Counsellor')).toBeInTheDocument();
  });

  it('shows validation error for short introduction', async () => {
    const user = userEvent.setup();
    render(<JoinUsPage />);

    await user.type(screen.getByPlaceholderText('Your Name'), 'Jane Doe');
    await user.type(screen.getByPlaceholderText('your@email.com'), 'jane@example.com');
    await user.selectOptions(screen.getByRole('combobox'), 'therapist');
    await user.type(screen.getByPlaceholderText('https://linkedin.com/in/...'), 'https://linkedin.com/in/jane');
    await user.type(screen.getByPlaceholderText("Tell us why you'd like to join Hope Trust..."), 'Short intro');

    const submitBtn = document.querySelector('button[type="submit"]')!;
    await user.click(submitBtn);

    expect(toast.error).toHaveBeenCalledWith('Introduction must be at least 20 characters');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('submits valid form data to Supabase', async () => {
    const user = userEvent.setup();
    render(<JoinUsPage />);

    await user.type(screen.getByPlaceholderText('Your Name'), 'Jane Doe');
    await user.type(screen.getByPlaceholderText('your@email.com'), 'jane@example.com');
    await user.selectOptions(screen.getByRole('combobox'), 'therapist');
    await user.type(screen.getByPlaceholderText('https://linkedin.com/in/...'), 'https://linkedin.com/in/jane');
    await user.type(screen.getByPlaceholderText("Tell us why you'd like to join Hope Trust..."), 'I am passionate about mental health and have 5 years of experience.');

    const submitBtn = document.querySelector('button[type="submit"]')!;
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        position: 'therapist',
        cv_link: 'https://linkedin.com/in/jane',
        introduction: "I am passionate about mental health and have 5 years of experience.",
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('shows error toast when submission fails', async () => {
    mockInsert.mockResolvedValue({ error: new Error('DB error') });
    const user = userEvent.setup();
    render(<JoinUsPage />);

    await user.type(screen.getByPlaceholderText('Your Name'), 'Jane Doe');
    await user.type(screen.getByPlaceholderText('your@email.com'), 'jane@example.com');
    await user.selectOptions(screen.getByRole('combobox'), 'therapist');
    await user.type(screen.getByPlaceholderText('https://linkedin.com/in/...'), 'https://linkedin.com/in/jane');
    await user.type(screen.getByPlaceholderText("Tell us why you'd like to join Hope Trust..."), 'I am passionate about mental health and have 5 years of experience.');

    const submitBtn = document.querySelector('button[type="submit"]')!;
    await user.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to submit application. Please try again.');
    });
  });
});
