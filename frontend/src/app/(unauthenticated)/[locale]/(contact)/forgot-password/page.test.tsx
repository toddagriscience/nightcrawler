// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { useActionState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import ForgotPassword from './page';

vi.mock('react', { spy: true });
vi.mock('@/lib/utils/actions', () => ({
  formatActionResponseErrors: vi.fn(),
}));

describe('ForgotPassword', () => {
  test('should render the form and initial prompt without errors', () => {
    vi.mocked(useActionState).mockImplementation(() => [
      null,
      vi.fn(() => {}),
      false,
    ]);

    render(<ForgotPassword />);

    expect(
      screen.getByRole('heading', { name: /reset your password/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please provide your account email/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

    // Ensure no error messages are visible
    expect(screen.queryByText(/We've sent an email/i)).not.toBeInTheDocument();
  });

  test('should display success message after successful submission', async () => {
    vi.mocked(formatActionResponseErrors).mockReturnValue([]);
    vi.mocked(useActionState).mockImplementation(() => [
      { success: true },
      vi.fn(() => {}),
      false,
    ]);

    render(<ForgotPassword />);

    expect(
      screen.getByText(
        /We've sent an email with the information needed to reset your password/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /reset password/i })
    ).toBeInTheDocument();

    // Ensure the form is gone
    expect(screen.queryByLabelText(/Email Address/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /submit/i })
    ).not.toBeInTheDocument();
  });

  test('should display error message after failed submission', async () => {
    const errorMessage = 'Invalid email or server error.';
    vi.mocked(formatActionResponseErrors).mockReturnValue([errorMessage]);
    vi.mocked(useActionState).mockImplementation(() => [
      { error: errorMessage },
      vi.fn(() => {}),
      false,
    ]);

    render(<ForgotPassword />);

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-red-500');

    // Ensure the form is still visible
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
