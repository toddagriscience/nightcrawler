// Copyright © Todd Agriscience, Inc. All rights reserved.

import { login } from '@/lib/actions/auth';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import enMessages from '@/messages/login/en.json';
import esMessages from '@/messages/login/es.json';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import ResizeObserver from 'resize-observer-polyfill';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, test, vitest } from 'vitest';
import Login from './page';

// Use real locale/message context; the navigation stub follows as-needed prefixes.
vitest.unmock('next-intl');

vitest.mock('@/i18n/config', async () => {
  const { useLocale } = await import('next-intl');

  return {
    Link: ({ href, ...props }: React.ComponentProps<'a'>) => {
      const locale = useLocale();
      const localizedHref = locale === 'en' ? href : `/${locale}${href}`;
      return <a href={localizedHref} {...props} />;
    },
  };
});

vitest.mock('@/lib/auth-client', () => ({
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

function renderLogin(locale: 'en' | 'es' = 'en') {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === 'en' ? enMessages : esMessages}
      timeZone="UTC"
    >
      <Login />
    </NextIntlClientProvider>
  );
}

describe('login page', () => {
  const mockPush = vitest.fn();

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    vitest.clearAllMocks();
  });

  test('renders login form', () => {
    renderLogin();

    expect(
      screen.getByRole('heading', { name: 'Login to Todd' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test.each([
    {
      locale: 'en' as const,
      prompt: 'Not yet a Todd Client?',
      linkName: 'Learn more about Todd Iris',
      href: '/index/introducing-iris',
    },
    {
      locale: 'es' as const,
      prompt: '¿Aún no eres cliente de Todd?',
      linkName: 'Más información sobre Todd Iris',
      href: '/es/index/introducing-iris',
    },
  ])(
    'preserves the $locale locale for the Todd Iris link',
    ({ locale, prompt, linkName, href }) => {
      renderLogin(locale);

      expect(screen.getByText(prompt, { exact: false })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: linkName })).toHaveAttribute(
        'href',
        href
      );
      expect(
        screen.queryByRole('link', { name: 'Learn how to become one' })
      ).not.toBeInTheDocument();
    }
  );

  test('shows spinner while loading', async () => {
    (login as Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 1000))
    );
    renderLogin();

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

    renderLogin();

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

    renderLogin();

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
    renderLogin();

    const passwordField = screen.getByTestId('password');

    await userEvent.type(passwordField, 'password');

    expect(passwordField).toHaveValue('password');

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));

    expect(passwordField).toHaveRole('textbox');
  });

  test('suppresses the browser native reveal control on the password field', () => {
    renderLogin();

    expect(screen.getByTestId('password')).toHaveClass(
      'hide-native-password-reveal'
    );
  });

  test('password toggle is reachable with the keyboard', async () => {
    renderLogin();

    screen.getByTestId('password').focus();

    await userEvent.tab();

    expect(screen.getByRole('button', { name: 'Show password' })).toHaveFocus();
  });

  test('does not submit unless both email and password are entered', async () => {
    renderLogin();
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
