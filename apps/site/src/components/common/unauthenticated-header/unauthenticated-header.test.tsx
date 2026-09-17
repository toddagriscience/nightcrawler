// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl } from '@/test/test-utils';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import UnauthenticatedHeader from './unauthenticated-header';

/**
 * `UnauthenticatedHeader` renders on `/signup`, which sits outside `[locale]`
 * and so has no `NextIntlClientProvider`. next-intl's `Link` calls `useLocale()`
 * and throws there, taking the whole page down through the root error boundary.
 *
 * The global Vitest setup stubs `@/i18n/config` with a plain anchor, which hides
 * exactly that failure. This mock restores the production behaviour: the
 * locale-aware `Link` throws when rendered, so the header must not reach for it.
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

describe('UnauthenticatedHeader', () => {
  it('renders on a page with no intl provider', () => {
    expect(() => render(<UnauthenticatedHeader />)).not.toThrow();
  });

  it('links the wordmark to the home page', () => {
    render(<UnauthenticatedHeader />);

    expect(screen.getByTestId('wordmark-link')).toHaveAttribute('href', '/');
  });

  it('renders the Todd home link without a help link', () => {
    renderWithNextIntl(<UnauthenticatedHeader />);

    expect(
      screen.getByRole('link', { name: 'Todd Agriscience home page' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Help' })
    ).not.toBeInTheDocument();
  });
});
