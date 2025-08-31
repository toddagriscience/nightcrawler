// Copyright Todd LLC, All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import Footer from './footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays "Let\'s Talk" heading', () => {
    renderWithNextIntl(<Footer />);
    expect(screen.getByTestId('lets-talk-heading')).toBeInTheDocument();
  });

  it('contains correct number of main navigation sections', () => {
    renderWithNextIntl(<Footer />);
    const sectionHeadings = screen.getAllByTestId(/-section-heading$/);
    expect(sectionHeadings).toHaveLength(3); // Number of main sections

    // Verify each section heading has correct styling
    sectionHeadings.forEach((heading) => {
      expect(heading).toHaveClass('font-semibold', 'md:font-thin');
    });
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

  it('includes Get In Touch button', () => {
    renderWithNextIntl(<Footer />);
    const getInTouchButton = screen.getByTestId('button-component');
    expect(getInTouchButton).toHaveAttribute('href', '/get-started');
    expect(getInTouchButton).toHaveTextContent('Get in Touch');
  });

  it('has social media links with correct structure', () => {
    renderWithNextIntl(<Footer />);

    const socialLinks = screen.getAllByTestId(/^social-link-/);
    expect(socialLinks).toHaveLength(3); // Number of social media links: instagram, linkedin, x

    // Verify each social link has required attributes
    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveClass('footer-underline');
    });
  });

  it('includes trust center external link', () => {
    renderWithNextIntl(<Footer />);
    const trustCenterLink = screen.getByTestId('trust-center-link');
    expect(trustCenterLink).toHaveAttribute(
      'href',
      'https://toddagriscience.safebase.us'
    );
    expect(trustCenterLink).toHaveAttribute('target', '_blank');
  });

  it('renders normally without isLoading prop', () => {
    renderWithNextIntl(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByTestId('lets-talk-heading')).toBeInTheDocument();
  });
});
