// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import Footer from './footer';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

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

  it('renders normally without isLoading prop', () => {
    renderWithNextIntl(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
