// Copyright © Todd Agriscience, Inc. All rights reserved.

import { updateUser } from '@/lib/actions/auth';
import { AuthResponseTypes } from '@/lib/types/auth';
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

vitest.mock('@/components/common', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/lib/actions/auth', () => ({
  updateUser: vi.fn(),
}));

describe('ResetPassword', () => {
  const mockPush = vitest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush });
    vitest.clearAllMocks();
  });

  test('should render the password reset form initially', () => {
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

  test('should toggle password visibility when "Show Password" button is clicked', async () => {
    render(<ResetPassword />);

    const newPasswordInput = screen.getByTestId(
      'new-password'
    ) as HTMLInputElement;
    expect(newPasswordInput.type).toBe('password');

    const toggleButton = screen.getAllByLabelText(/show password/i)[0];
    await user.click(toggleButton);

    expect(newPasswordInput.type).toBe('text');

    await user.click(toggleButton);
    expect(newPasswordInput.type).toBe('password');
  });

  test('should enable/disable submit button based on PasswordChecklist callback', async () => {
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

  test('should show success screen and redirect to dashboard on successful action', async () => {
    vi.mocked(updateUser).mockResolvedValue({
      error: null,
      responseType: AuthResponseTypes.UpdateUser,
    });

    render(<ResetPassword />);

    fireEvent.change(screen.getByTestId('new-password'), {
      target: { value: 'P@ssword1' },
    });
    fireEvent.change(screen.getByTestId('confirm-new-password'), {
      target: { value: 'P@ssword1' },
    });

    const submitButton = await screen.findByRole('button', { name: /Save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Password reset successful/i })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Your password has been updated successfully./i)
    ).toBeInTheDocument();

    const dashboardButton = screen.getByRole('button', { name: /Dashboard/i });
    await user.click(dashboardButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('should show error message when action returns an error', async () => {
    const ERROR_MESSAGE = 'The session token has expired.';
    vi.mocked(updateUser).mockResolvedValue({
      error: ERROR_MESSAGE,
      responseType: AuthResponseTypes.UpdateUser,
    });

    render(<ResetPassword />);

    fireEvent.change(screen.getByTestId('new-password'), {
      target: { value: 'P@ssword1' },
    });
    fireEvent.change(screen.getByTestId('confirm-new-password'), {
      target: { value: 'P@ssword1' },
    });

    const submitButton = await screen.findByRole('button', { name: /Save/i });
    await user.click(submitButton);

    const errorElement = await screen.findByText(ERROR_MESSAGE);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-red-500');
  });

  test('should call router.push("/") when the CANCEL button is clicked', async () => {
    render(<ResetPassword />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    await user.click(cancelButton);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
