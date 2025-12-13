// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPassword from './page';
import { useActionState } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: '/login',
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: jest.fn(),
}));

// i have no clue why we have to do this. usePathname is mocked right above this??? i hate tests so much
jest.mock('@/components/common', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => children,
}));
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('ResetPassword', () => {
  const mockPush = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test('should render the password reset form initially', () => {
    (useActionState as jest.Mock).mockReturnValue([null, null]);
    render(<ResetPassword />);

    expect(
      screen.getByRole('heading', { name: 'RESET PASSWORD' })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm New Password')
    ).toBeInTheDocument();
    expect(screen.getByText('Show Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CANCEL/i })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', {
      name: /INVALID PASSWORD/i,
    });
    expect(submitButton).toBeDisabled();
  });

  test('should toggle password visibility when "Show Password" checkbox is clicked', async () => {
    render(<ResetPassword />);

    const newPasswordInput = screen.getByTestId(
      'new-password'
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId(
      'confirm-new-password'
    ) as HTMLInputElement;
    const checkbox = screen.getByTestId('show-password-checkbox');

    expect(newPasswordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');

    await user.click(checkbox);

    await waitFor(() => {
      expect(newPasswordInput.type).toBe('text');
      expect(confirmPasswordInput.type).toBe('text');
    });

    await user.click(checkbox);

    await waitFor(() => {
      expect(newPasswordInput.type).toBe('password');
      expect(confirmPasswordInput.type).toBe('password');
    });
  });

  test('should enable/disable submit button based on PasswordChecklist callback', async () => {
    render(<ResetPassword />);
    const submitButton = screen.getByText('INVALID PASSWORD');

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('INVALID PASSWORD');

    fireEvent.change(screen.getByTestId('new-password'), {
      target: { value: 'P@ssword1' },
    });
    fireEvent.change(screen.getByTestId('confirm-new-password'), {
      target: { value: 'P@ssword1' },
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('SAVE');
    });

    fireEvent.change(screen.getByTestId('new-password'), {
      target: { value: 'P@ssword2' },
    });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('INVALID PASSWORD');
    });
  });

  // Test 4: Successful Submission (Redirect to Dashboard)
  test('should show success screen and redirect to dashboard on successful action', async () => {
    const SUCCESS_STATE = { success: true };
    const ACTION_FN = jest.fn(() => SUCCESS_STATE);

    // Set the state to success by mocking useActionState to return the success state
    (useActionState as jest.Mock).mockReturnValue([[], ACTION_FN]);
    render(<ResetPassword />);

    // Check for success message content
    expect(
      screen.getByRole('heading', { name: /PASSWORD RESET SUCCESFULL/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your password has been updated successfully./i)
    ).toBeInTheDocument();

    // Find the dashboard button
    const dashboardButton = screen.getByRole('button', { name: /DASHBOARD/i });
    expect(dashboardButton).toBeInTheDocument();

    // Simulate clicking the dashboard button
    await user.click(dashboardButton);

    // Check if redirect was called
    expect(useRouter().push as jest.Mock).toHaveBeenCalledWith('/');
  });

  // Test 5: Failed Submission (Error Screen)
  test('should show error message when action state contains an error', () => {
    const ERROR_MESSAGE = 'The session token has expired.';
    const ERROR_STATE = { error: new AuthError(ERROR_MESSAGE) };

    // Set the state to error by mocking useActionState to return the error state
    (useActionState as jest.Mock).mockReturnValue([ERROR_STATE, null]);
    render(<ResetPassword />);

    // Check for the error message
    const errorElement = screen.getByText(ERROR_MESSAGE);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-red-500');

    // Ensure the form is still visible
    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
  });

  // Test 6: Cancel Button Click
  test('should call router.push("/") when the CANCEL button is clicked', async () => {
    render(<ResetPassword />);

    const cancelButton = screen.getByRole('button', { name: /CANCEL/i });

    await user.click(cancelButton);

    // Check that router.push was called with the correct path
    expect(useRouter().push as jest.Mock).toHaveBeenCalledTimes(1);
    expect(useRouter().push as jest.Mock).toHaveBeenCalledWith('/');
  });
});
