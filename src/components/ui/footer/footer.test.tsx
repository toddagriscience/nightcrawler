import { screen, renderWithAct } from '@/test/test-utils';
import type { Translations } from '@/test/test-utils';
import Footer from './footer';
import '@testing-library/jest-dom';

const customTranslations = {
  'navigation.footer.cta.letsTalk': "Let's Talk",
  'navigation.footer.cta.getInTouch': 'Get In Touch',
  'navigation.footer.cta.privacyOptions': 'Privacy Options',
  'navigation.footer.sections.todd': 'Todd',
  'navigation.footer.sections.connect': 'Connect',
  'navigation.footer.sections.legal': 'Legal',
  'navigation.footer.links.home': 'Home',
  'navigation.footer.links.about': 'About',
  'navigation.footer.links.offerings': 'Offerings',
  'navigation.footer.links.approach': 'Approach',
  'navigation.footer.links.impact': 'Impact',
  'navigation.footer.links.news': 'News',
  'navigation.footer.links.contact': 'Contact',
  'navigation.footer.links.careers': 'Careers',
  'navigation.footer.links.journal': 'Journal',
  'navigation.footer.links.investorRelations': 'Investor Relations',
  'navigation.footer.links.foundation': 'Foundation',
  'navigation.footer.links.instagram': 'Instagram',
  'navigation.footer.links.linkedin': 'LinkedIn',
  'navigation.footer.links.x': 'X',
  'navigation.footer.links.accessibility': 'Accessibility',
  'navigation.footer.links.privacy': 'Privacy',
  'navigation.footer.links.terms': 'Terms',
  'navigation.footer.links.trustCenter': 'Trust Center',
  'navigation.footer.copyright': '© Todd Agriscience, Inc. {year}',
  'common.accessibility.privacy': 'Privacy Options',
} satisfies Translations;

describe('Footer', () => {
  it('renders without crashing', async () => {
    await renderWithAct(<Footer />, { translations: customTranslations });
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays "Let\'s Talk" heading', async () => {
    await renderWithAct(<Footer />, { translations: customTranslations });
    expect(screen.getByTestId('lets-talk-heading')).toBeInTheDocument();
  });

  it('contains correct number of main navigation sections', async () => {
    await renderWithAct(<Footer />, { translations: customTranslations });
    const sectionHeadings = screen.getAllByTestId(/-section-heading$/);
    expect(sectionHeadings).toHaveLength(3); // Number of main sections

    // Verify each section heading has correct styling
    sectionHeadings.forEach((heading) => {
      expect(heading).toHaveClass('font-semibold', 'md:font-thin');
    });
  });

  it('includes internal navigation links with correct structure', async () => {
    await renderWithAct(<Footer />, { translations: customTranslations });
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

  it('includes Get In Touch button', async () => {
    await renderWithAct(<Footer />, { translations: customTranslations });
    const getInTouchButton = screen.getByTestId('button-component');
    expect(getInTouchButton).toHaveAttribute('href', '/contact');
    expect(getInTouchButton).toHaveTextContent('Get In Touch');
  });

  it('includes privacy options link', async () => {
    await renderWithAct(<Footer />, { translations: customTranslations });
    const privacyLink = screen.getByTestId('privacy-options-link');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });

  it('has social media links with correct structure', async () => {
    await renderWithAct(<Footer />, { translations: customTranslations });

    const socialLinks = screen.getAllByTestId(/^social-link-/);
    expect(socialLinks).toHaveLength(3); // Number of social media links: instagram, linkedin, x

    // Verify each social link has required attributes
    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveClass('footer-underline');
    });
  });

  it('includes trust center external link', async () => {
    await renderWithAct(<Footer />, { translations: customTranslations });
    const trustCenterLink = screen.getByTestId('trust-center-link');
    expect(trustCenterLink).toHaveAttribute(
      'href',
      'https://toddagriscience.safebase.us'
    );
    expect(trustCenterLink).toHaveAttribute('target', '_blank');
  });

  it('displays loading spinner when isLoading is true', async () => {
    await renderWithAct(<Footer />, { isLoading: true });
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
