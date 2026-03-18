// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { sendResetPasswordEmail } from '@/lib/actions/auth';
import { AuthResponseTypes } from '@/lib/types/auth';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import ForgotPassword from './page';

vi.mock('@/lib/utils/actions', () => ({
  formatActionResponseErrors: vi.fn(),
}));

vi.mock('@/lib/actions/auth', () => ({
  sendResetPasswordEmail: vi.fn(),
}));

describe('ForgotPassword', () => {
  test('should render the form and initial prompt without errors', () => {
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
    vi.mocked(sendResetPasswordEmail).mockResolvedValue({
      error: null,
      responseType: AuthResponseTypes.SendResetPasswordEmail,
    });

    const user = userEvent.setup();
    render(<ForgotPassword />);

    await user.type(
      screen.getByLabelText(/Email Address/i),
      'test@example.com'
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          /We've sent an email with the information needed to reset your password/i
        )
      ).toBeInTheDocument();
    });
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
    vi.mocked(sendResetPasswordEmail).mockResolvedValue({
      error: errorMessage,
      responseType: AuthResponseTypes.SendResetPasswordEmail,
    });
    vi.mocked(formatActionResponseErrors).mockReturnValue([errorMessage]);

    const user = userEvent.setup();
    render(<ForgotPassword />);

    await user.type(
      screen.getByLabelText(/Email Address/i),
      'test@example.com'
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));

    const errorElement = await screen.findByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-red-500');

    // Ensure the form is still visible
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
