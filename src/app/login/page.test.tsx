// Copyright Todd Agriscience, Inc. All rights reserved.

/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './page';
import { login } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { loginErrors } from '@/lib/auth';

jest.mock('@/lib/auth', () => ({
  login: jest.fn(),
  loginErrors: jest.fn(),
}));

jest.mock('@/lib/actions/auth', () => ({
  login: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: '/login',
}));

jest.mock('@/lib/env', () => ({
  env: {
    baseUrl: 'https://example.com',
  },
}));

jest.mock('@/components/common', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => children,
}));

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('login page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<Login />);

    expect(screen.getAllByText('LOGIN')).toHaveLength(2);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('shows spinner while loading', async () => {
    (login as jest.Mock).mockImplementation(
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
    (login as jest.Mock).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });
    (loginErrors as jest.Mock).mockReturnValue(['Invalid credentials']);

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
    (login as jest.Mock).mockReturnValue({
      error: 'Network down',
      data: {},
    });
    (loginErrors as jest.Mock).mockReturnValue(['Network down']);

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
    (login as jest.Mock).mockReturnValue({ error: null });

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
