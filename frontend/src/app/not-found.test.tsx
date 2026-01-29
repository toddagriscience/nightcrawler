// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { getTranslations } from 'next-intl/server';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import NotFound from './not-found';

// Mock the child components to verify which one is rendered
vi.mock(
  '@/components/common/authenticated-header/authenticated-header',
  () => ({
    default: () => (
      <div data-testid="authenticated-header">Authenticated Header</div>
    ),
  })
);

vi.mock('@/components/landing', () => ({
  Header: () => <div data-testid="public-header">Public Header</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
}));

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
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock Supabase
const mockGetUser = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

describe('NotFound Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default translation mock
    (getTranslations as unknown as Mock).mockResolvedValue(
      Object.assign(
        (key: string) =>
          key === 'notFound.title' ? 'Page not available' : key,
        {
          rich: (key: string, chunks: any) => {
            // Simulate rendering the chunks to ensure Links are called
            const home = chunks.home('homepage');
            const news = chunks.news('news');
            return (
              <div>
                {key} {home} {news}
              </div>
            );
          },
        }
      )
    );
  });

  it('should render AuthenticatedHeader when user is logged in', async () => {
    // Mock authenticated user
    mockGetUser.mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
    });

    const jsx = await NotFound();
    render(jsx);

    expect(screen.getByTestId('authenticated-header')).toBeInTheDocument();
    expect(screen.queryByTestId('public-header')).not.toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render Public Header when user is not logged in', async () => {
    // Mock unauthenticated user
    mockGetUser.mockResolvedValue({
      data: { user: null },
    });

    const jsx = await NotFound();
    render(jsx);

    expect(screen.getByTestId('public-header')).toBeInTheDocument();
    expect(
      screen.queryByTestId('authenticated-header')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render the correct translation for title', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const jsx = await NotFound();
    render(jsx);

    expect(screen.getByText('Page not available')).toBeInTheDocument();
  });
});
