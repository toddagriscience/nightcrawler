// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './page';
import { login } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { beforeEach, describe, expect, test, vitest } from 'vitest';
import type { Mock } from 'vitest';
import ResizeObserver from 'resize-observer-polyfill';

vitest.mock('@/lib/auth', () => ({
  login: vitest.fn(),
}));

vitest.mock('@/lib/utils/actions', () => ({
  formatActionResponseErrors: vitest.fn(),
}));

vitest.mock('@/lib/actions/auth', () => ({
  login: vitest.fn(),
}));

vitest.mock('next/navigation', () => ({
  useRouter: vitest.fn(),
  usePathname: '/login',
}));

vitest.mock('@/lib/env', () => ({
  env: {
    baseUrl: 'https://example.com',
  },
}));

vitest.mock('@/components/common', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => children,
}));

global.ResizeObserver = ResizeObserver;

describe('login page', () => {
  const mockPush = vitest.fn();

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    vitest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<Login />);

    expect(
      screen.getByRole('heading', { name: 'Login to Todd' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('shows spinner while loading', async () => {
    (login as Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 1000))
    );
    render(<Login />);

    const emailField = screen.getByTestId('email');
    const passwordField = screen.getByTestId('password');

    await userEvent.type(emailField, 'test@example.com');
    await userEvent.type(passwordField, 'test@example.com');

    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  test('failed login shows error message', async () => {
    (login as Mock).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });
    (formatActionResponseErrors as Mock).mockReturnValue([
      'Invalid credentials',
    ]);

    render(<Login />);

    const emailField = screen.getByTestId('email');
    const passwordField = screen.getByTestId('password');

    await userEvent.type(emailField, 'test@example.com');
    await userEvent.type(passwordField, 'test@example.com');

    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('shows error if login() throws', async () => {
    (login as Mock).mockReturnValue({
      error: 'Network down',
      data: {},
    });
    (formatActionResponseErrors as Mock).mockReturnValue(['Network down']);

    render(<Login />);

    const emailField = screen.getByTestId('email');
    const passwordField = screen.getByTestId('password');

    await userEvent.type(emailField, 'test@example.com');
    await userEvent.type(passwordField, 'test@example.com');

    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
      expect(screen.getByText('Network down')).toBeInTheDocument();
    });
  });

  test('shows and hides password appropriately', async () => {
    render(<Login />);

    const passwordField = screen.getByTestId('password');

    await userEvent.type(passwordField, 'password');

    expect(passwordField).toHaveValue('password');

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));

    expect(passwordField).toHaveRole('textbox');
  });

  test('does not submit unless both email and password are entered', async () => {
    render(<Login />);
    (login as Mock).mockReturnValue({ error: null });

    const emailField = screen.getByTestId('email');
    const passwordField = screen.getByTestId('password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    // type in email field but not password
    await userEvent.type(emailField, 'test@example.com');
    await userEvent.click(submitButton);
    expect(login).not.toHaveBeenCalled();

    // type in password field but not email
    await userEvent.type(passwordField, 'test@example.com');
    await userEvent.clear(emailField);
    await userEvent.click(submitButton);
    expect(login).not.toHaveBeenCalled();

    // type in both
    await userEvent.type(emailField, 'test@example.com');
    await userEvent.click(submitButton);
    expect(login).toHaveBeenCalled();
  });
});
