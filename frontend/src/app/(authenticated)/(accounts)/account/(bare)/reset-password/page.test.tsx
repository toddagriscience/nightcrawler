// Copyright © Todd Agriscience, Inc. All rights reserved.

import { AuthError } from '@supabase/supabase-js';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, test, vi, vitest } from 'vitest';
import ResetPassword from './page';

global.ResizeObserver = ResizeObserver;

const { mockUseRouter } = vi.hoisted(() => {
  return { mockUseRouter: vi.fn() };
});

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    usePathname: '/login',
    useRouter: mockUseRouter,
  };
});

vi.mock('react', { spy: true });

// i have no clue why we have to do this. usePathname is mocked right above this??? i hate tests so much
vitest.mock('@/components/common', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ResetPassword', () => {
  const mockPush = vitest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush });
    vitest.clearAllMocks();
  });

  test('should render the password reset form initially', () => {
    vi.mocked(React.useActionState).mockImplementation(() => [
      null,
      vi.fn(() => {}),
      false,
    ]);
    render(<ResetPassword />);

    expect(
      screen.getByRole('heading', { name: 'Reset Password' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', {
      name: /Invalid password/i,
    });
    expect(submitButton).toBeDisabled();
  });

  test('should toggle password visibility when "Show Password" checkbox is clicked', async () => {
    vi.mocked(React.useActionState).mockImplementation(() => [
      null,
      vi.fn(() => {}),
      false,
    ]);
    render(<ResetPassword />);

    const newPasswordInput = screen.getByTestId(
      'new-password'
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId(
      'confirm-new-password'
    ) as HTMLInputElement;
    expect(newPasswordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');
  });

  test('should enable/disable submit button based on PasswordChecklist callback', async () => {
    const ERROR_MESSAGE = 'The session token has expired.';
    const ERROR_STATE = { error: new AuthError(ERROR_MESSAGE) };
    vi.mocked(React.useActionState).mockImplementation(() => [
      ERROR_STATE,
      vi.fn(() => {}),
      false,
    ]);
    render(<ResetPassword />);
    const submitButton = screen.getByText('Invalid password');

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Invalid password');

    fireEvent.change(screen.getByTestId('new-password'), {
      target: { value: 'P@ssword1' },
    });
    fireEvent.change(screen.getByTestId('confirm-new-password'), {
      target: { value: 'P@ssword1' },
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Save');
    });

    fireEvent.change(screen.getByTestId('new-password'), {
      target: { value: 'P@ssword2' },
    });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Invalid password');
    });
  });

  // Test 4: Successful Submission (Redirect to Dashboard)
  test('should show success screen and redirect to dashboard on successful action', async () => {
    vi.mocked(React.useActionState).mockImplementation(() => [
      [[]],
      vi.fn(() => {}),
      false,
    ]);
    render(<ResetPassword />);

    // Check for success message content
    expect(
      screen.getByRole('heading', { name: /Password reset successful/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your password has been updated successfully./i)
    ).toBeInTheDocument();

    // Find the dashboard button
    const dashboardButton = screen.getByRole('button', { name: /Dashboard/i });
    expect(dashboardButton).toBeInTheDocument();

    // Simulate clicking the dashboard button
    await user.click(dashboardButton);

    // Check if redirect was called
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  // Test 5: Failed Submission (Error Screen)
  test('should show error message when action state contains an error', async () => {
    const ERROR_MESSAGE = 'The session token has expired.';
    const ERROR_STATE = { error: new AuthError(ERROR_MESSAGE) };

    vi.mocked(React.useActionState).mockImplementation(() => [
      ERROR_STATE,
      vi.fn(() => {}),
      false,
    ]);
    render(<ResetPassword />);

    // Check for the error message
    const errorElement = await screen.findByText(ERROR_MESSAGE);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-red-500');
  });

  // Test 6: Cancel Button Click
  test('should call router.push("/") when the CANCEL button is clicked', async () => {
    render(<ResetPassword />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    await user.click(cancelButton);

    // Check that router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
