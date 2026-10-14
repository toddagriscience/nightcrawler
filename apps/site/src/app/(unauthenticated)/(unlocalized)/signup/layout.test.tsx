// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Layout from './layout';

/**
 * `/signup` sits outside `[locale]`, so nothing in this tree is wrapped in a
 * `NextIntlClientProvider`. next-intl's locale-aware `Link` calls `useLocale()`
 * and throws without one, which takes the whole signup page down through the
 * root error boundary and breaks every approval link.
 *
 * The global Vitest setup stubs `@/i18n/config` with a plain anchor and hides
 * that. Here the stub throws instead, so this layout fails the moment it renders
 * anything that needs the provider.
 */
vi.mock('@/i18n/config', () => ({
  Link: () => {
    throw new Error('No intl context found');
  },
  routing: { locales: ['en', 'es'], defaultLocale: 'en' },
  redirect: vi.fn(),
  usePathname: vi.fn(() => '/signup'),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
}));

describe('signup layout', () => {
  it('renders without a NextIntlClientProvider', () => {
    expect(() =>
      render(<Layout>{<p>Create your password</p>}</Layout>)
    ).not.toThrow();
  });

  it('renders its page content', () => {
    render(<Layout>{<p>Create your password</p>}</Layout>);

    expect(screen.getByText('Create your password')).toBeInTheDocument();
  });
});
