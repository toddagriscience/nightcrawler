// Copyright © Todd Agriscience, Inc. All rights reserved.

import { act, render, screen } from '@testing-library/react';
import { getLocale, getTranslations } from 'next-intl/server';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import NotFound from './not-found';
import { renderWithNextIntl } from '@/test/test-utils';

// Mock the child components to verify which one is rendered
vi.mock(
  '@/components/common/authenticated-header/authenticated-header',
  () => ({
    default: () => (
      <div data-testid="authenticated-header">Authenticated Header</div>
    ),
  })
);

vi.mock(
  '@/components/common/unauthenticated-header/unauthenticated-header',
  () => ({
    default: () => (
      <div data-testid="unauthenticated-header">Unauthenticated Header</div>
    ),
  })
);

vi.mock('@/components/common', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SmoothScroll: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock next-intl
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
  getMessages: vi.fn().mockResolvedValue({}),
  getLocale: vi.fn(),
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/i18n/config', () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const mockGetUser = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

describe('NotFound Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (getLocale as Mock).mockResolvedValue('en');
    mockGetUser.mockResolvedValue({ data: { user: null } });

    // Default translation mock
    (getTranslations as unknown as Mock).mockResolvedValue(
      Object.assign(
        (key: string) => {
          if (key === 'notFound.title') return '404';
          if (key === 'notFound.message')
            return 'The page you are looking for could not be found. Please check the URL and try again.';
          if (key === 'notFound.homeButton') return 'Home';
          return key;
        },
        {
          rich: (key: string, chunks: any) => {
            const home = chunks.home('home');
            return (
              <div>
                {key} {home}
              </div>
            );
          },
        }
      )
    );
  });

  it('should render AuthenticatedHeader when user is logged in', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
        },
      },
    });

    await act(() => {
      renderWithNextIntl(NotFound());
    });

    await expect(
      screen.getByTestId('authenticated-header')
    ).toBeInTheDocument();
    await expect(
      screen.queryByTestId('unauthenticated-header')
    ).not.toBeInTheDocument();
  });

  it('should render Public Header when user is not logged in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await act(() => {
      renderWithNextIntl(NotFound());
    });

    await expect(
      screen.getByTestId('unauthenticated-header')
    ).toBeInTheDocument();
    await expect(
      screen.queryByTestId('authenticated-header')
    ).not.toBeInTheDocument();
  });

  it('should render the correct translation for title', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await act(() => {
      renderWithNextIntl(NotFound());
    });

    await expect(screen.getByText('404')).toBeInTheDocument();
    await expect(
      screen.getByText(
        'The page you are looking for could not be found. Please check the URL and try again.'
      )
    ).toBeInTheDocument();
  });

  it('should use the correct locale', async () => {
    (getLocale as Mock).mockResolvedValue('es');
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await act(() => {
      renderWithNextIntl(NotFound());
    });

    await expect(getTranslations).toHaveBeenCalledWith({
      locale: 'es',
      namespace: 'common',
    });
  });
});
