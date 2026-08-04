// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  screen,
  within,
  fireEvent,
  renderWithNextIntl,
} from '@/test/test-utils';
import Footer from './footer';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';
import { afterEach, describe, it, expect, vi } from 'vitest';

describe('Footer', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('includes internal navigation links with correct structure', () => {
    renderWithNextIntl(<Footer />);
    const internalLinks = screen.getAllByRole('link').filter((link) => {
      const href = link.getAttribute('href');
      const testId = link.getAttribute('data-testid');
      // Exclude the "Get In Touch" button which has different styling
      return (
        href &&
        href.startsWith('/') &&
        !href.includes('://') &&
        testId !== 'get-in-touch-link'
      );
    });

    // Should have multiple internal navigation links
    expect(internalLinks.length).toBeGreaterThan(0);
  });

  it('renders footer link groups in the expected order', () => {
    renderWithNextIntl(<Footer />);

    expect(screen.getByRole('heading', { name: 'Todd' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Terms & Policies' })
    ).toBeInTheDocument();

    expect(
      screen
        .getAllByRole('link')
        .filter((link) =>
          [
            'Research',
            'About',
            'Careers',
            'News',
            'Terms of Use',
            'Privacy Policy',
            'Accessibility',
            'Legal',
          ].includes(link.textContent ?? '')
        )
        .map((link) => link.textContent)
    ).toEqual([
      'Research',
      'About',
      'Careers',
      'News',
      'Terms of Use',
      'Privacy Policy',
      'Accessibility',
      'Legal',
    ]);
  });

  it('has social media links with accessible names via aria-label', () => {
    renderWithNextIntl(<Footer />);

    // Verify each social media link has the correct accessible name
    expect(
      screen.getByRole('link', { name: 'Visit our Instagram page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Visit our LinkedIn page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Visit our X (Twitter) page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Visit our YouTube channel' })
    ).toBeInTheDocument();
  });

  it('renders the location as a static label outside the language button', async () => {
    renderWithNextIntl(<Footer />);

    const location = screen.getByText('United States');
    expect(location.closest('button')).toBeNull();

    await fireEvent.click(location);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens the language menu from the language button', async () => {
    renderWithNextIntl(<Footer />);

    await fireEvent.click(
      screen.getByRole('button', { name: 'Change language' })
    );

    const menu = screen.getByRole('menu');
    expect(
      within(menu).getByRole('menuitem', { name: 'English' })
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole('menuitem', { name: 'Español' })
    ).toBeInTheDocument();
  });

  it('renders normally without isLoading prop', () => {
    renderWithNextIntl(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  describe('switching locale', () => {
    const chooseLanguage = async (name: string) => {
      await fireEvent.click(
        screen.getByRole('button', { name: 'Change language' })
      );
      await fireEvent.click(
        within(screen.getByRole('menu')).getByRole('menuitem', { name })
      );
    };

    // Routing uses `localePrefix: 'as-needed'`, so navigation has to add and
    // remove the prefix rather than overwrite the first segment.
    const stubLocation = (pathname: string) => {
      vi.mocked(usePathname).mockReturnValue(pathname);
      const assign = vi.fn();
      vi.stubGlobal('location', { ...window.location, pathname, assign });
      return assign;
    };

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.mocked(usePathname).mockReturnValue('/');
    });

    it('prefixes a nested page instead of overwriting its first segment', async () => {
      const assign = stubLocation('/research/index');

      renderWithNextIntl(<Footer />);
      await chooseLanguage('Español');

      expect(assign).toHaveBeenCalledWith('/es/research/index');
    });

    it('strips the prefix when returning to the default locale', async () => {
      const assign = stubLocation('/es/research/index');

      renderWithNextIntl(<Footer />);
      await chooseLanguage('English');

      expect(assign).toHaveBeenCalledWith('/research/index');
    });

    it('prefixes the homepage', async () => {
      const assign = stubLocation('/');

      renderWithNextIntl(<Footer />);
      await chooseLanguage('Español');

      expect(assign).toHaveBeenCalledWith('/es');
    });

    it('does not navigate when the chosen locale is already active', async () => {
      const assign = stubLocation('/research/index');

      renderWithNextIntl(<Footer />);
      await chooseLanguage('English');

      expect(assign).not.toHaveBeenCalled();
    });
  });
});
