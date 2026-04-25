import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Loading from '@/app/loading';

describe('Loading Page', () => {
  it('renders loading text', () => {
    render(<Loading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders a spinner element', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });
});
