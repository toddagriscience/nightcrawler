// Copyright Todd Agriscience, Inc. All rights reserved.

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './page';
import { login } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { loginErrors } from '@/lib/auth';
import { beforeEach, describe, expect, test, vitest } from 'vitest';
import type { Mock } from 'vitest';
import ResizeObserver from 'resize-observer-polyfill';

vitest.mock('@/lib/auth', () => ({
  login: vitest.fn(),
  loginErrors: vitest.fn(),
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

    expect(screen.getAllByText('LOGIN')).toHaveLength(2);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
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

    userEvent.click(screen.getByRole('button', { name: 'LOGIN' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  test('failed login shows error message', async () => {
    (login as Mock).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });
    (loginErrors as Mock).mockReturnValue(['Invalid credentials']);

    render(<Login />);

    const emailField = screen.getByTestId('email');
    const passwordField = screen.getByTestId('password');

    await userEvent.type(emailField, 'test@example.com');
    await userEvent.type(passwordField, 'test@example.com');

    userEvent.click(screen.getByRole('button', { name: 'LOGIN' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('shows error if login() throws', async () => {
    (login as Mock).mockReturnValue({
      error: 'Network down',
      data: {},
    });
    (loginErrors as Mock).mockReturnValue(['Network down']);

    render(<Login />);

    const emailField = screen.getByTestId('email');
    const passwordField = screen.getByTestId('password');

    await userEvent.type(emailField, 'test@example.com');
    await userEvent.type(passwordField, 'test@example.com');

    userEvent.click(screen.getByRole('button', { name: 'LOGIN' }));

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

    fireEvent.click(screen.getByRole('checkbox'));

    // type is textbox and not text? whatever
    expect(passwordField).toHaveRole('textbox');
  });

  test('does not submit unless both email and password are entered', async () => {
    render(<Login />);
    (login as Mock).mockReturnValue({ error: null });

    const emailField = screen.getByTestId('email');
    const passwordField = screen.getByTestId('password');
    const submitButton = screen.getByRole('button', { name: 'LOGIN' });

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
