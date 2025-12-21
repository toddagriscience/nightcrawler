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

  it('has social media links with correct structure', () => {
    renderWithNextIntl(<Footer />);

    const socialLinks = screen.getAllByRole('img');
    expect(socialLinks).toHaveLength(5); // social media icons + flag
  });

  it('renders normally without isLoading prop', () => {
    renderWithNextIntl(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
