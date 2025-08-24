import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays "Let\'s Talk" heading', () => {
    render(<Footer />);
    expect(screen.getByTestId('lets-talk-heading')).toBeInTheDocument();
  });

  it('contains correct number of main navigation sections', () => {
    render(<Footer />);
    const sectionHeadings = screen.getAllByTestId(/-section-heading$/);
    expect(sectionHeadings).toHaveLength(3); // Number of main sections

    // Verify each section heading has correct styling
    sectionHeadings.forEach((heading) => {
      expect(heading).toHaveClass('font-semibold', 'md:font-thin');
    });
  });

  it('includes internal navigation links with correct structure', () => {
    render(<Footer />);
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
    render(<Footer />);
    const getInTouchLink = screen.getByTestId('get-in-touch-link');
    expect(getInTouchLink).toHaveAttribute('href', '/contact');
  });

  it('displays copyright information', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© Todd Agriscience, Inc. ${currentYear}`)
    ).toBeInTheDocument();
  });

  it('includes privacy options link', () => {
    render(<Footer />);
    const privacyLink = screen.getByTestId('privacy-options-link');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });

  it('has social media links with correct structure', () => {
    render(<Footer />);

    const socialLinks = screen.getAllByTestId(/^social-link-/);
    expect(socialLinks).toHaveLength(3); // Number of social media links

    // Verify each social link has required attributes
    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveClass('footer-underline');
    });
  });

  it('includes trust center external link', () => {
    render(<Footer />);
    const trustCenterLink = screen.getByTestId('trust-center-link');
    expect(trustCenterLink).toHaveAttribute(
      'href',
      'https://toddagriscience.safebase.us'
    );
    expect(trustCenterLink).toHaveAttribute('target', '_blank');
  });
});
