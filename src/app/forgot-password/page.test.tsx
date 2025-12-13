// Copyright Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import ForgotPassword from './page';
import { useActionState } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { describe, test, expect, vi, Mock } from 'vitest';

vi.mock('react', { spy: true });

describe('ForgotPassword', () => {
  test('should render the form and initial prompt without errors', () => {
    vi.mocked(useActionState).mockImplementation(() => [
      null,
      vi.fn(() => {
        success: true;
      }),
      false,
    ]);

    render(<ForgotPassword />);

    expect(
      screen.getByRole('heading', { name: /reset password/i })
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
    const { rerender } = render(<ForgotPassword />);

    expect(
      screen.getByRole('heading', { name: /reset password/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please provide your account email/i)
    ).toBeInTheDocument();

    // Rerender the component with the successful state returned by the mock
    vi.mocked(useActionState).mockImplementation(() => [
      [[]],
      vi.fn(() => {
        success: true;
      }),
      false,
    ]);
    rerender(<ForgotPassword />);

    expect(
      screen.getByText(
        /We've sent an email with the information needed to reset your password/i
      )
    ).toBeInTheDocument();

    // Ensure the form is gone
    expect(screen.queryByLabelText(/Email Address/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /submit/i })
    ).not.toBeInTheDocument();
  });

  test('should display error message after failed submission', async () => {
    const errorMessage = 'Invalid email or server error.';
    vi.mocked(useActionState).mockImplementation(() => [
      { error: errorMessage },
      vi.fn(() => {
        success: true;
      }),
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
