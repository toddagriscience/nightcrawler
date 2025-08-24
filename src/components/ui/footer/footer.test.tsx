import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays "Let\'s Talk" heading', () => {
    render(<Footer />);
    expect(screen.getByText("Let's Talk")).toBeInTheDocument();
  });

  it('contains main navigation sections', () => {
    render(<Footer />);
    expect(screen.getByText('Todd')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  it('includes contact link', () => {
    render(<Footer />);
    const contactLinks = screen.getAllByText('Contact');
    expect(contactLinks).toHaveLength(1);
    expect(contactLinks[0].closest('a')).toHaveAttribute('href', '/contact');
  });

  it('includes Get In Touch button', () => {
    render(<Footer />);
    const getInTouchLink = screen.getByText('Get In Touch').closest('a');
    expect(getInTouchLink).toHaveAttribute('href', '/contact');
  });

  it('displays copyright information', () => {
    render(<Footer />);
    expect(
      screen.getByText('© Todd Agriscience, Inc. 2025')
    ).toBeInTheDocument();
  });

  it('includes privacy options link', () => {
    render(<Footer />);
    expect(
      screen.getByText('Do Not Sell or Share My Data')
    ).toBeInTheDocument();
  });

  it('has social media links with correct attributes', () => {
    render(<Footer />);

    const instagramLink = screen.getByText('Instagram').closest('a');
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://instagram.com/toddagriscience'
    );
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = screen.getByText('LinkedIn').closest('a');
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://linkedin.com/company/toddagriscience'
    );
    expect(linkedinLink).toHaveAttribute('target', '_blank');

    const xLink = screen.getByText('X').closest('a');
    expect(xLink).toHaveAttribute('href', 'https://x.com/toddagriscience');
    expect(xLink).toHaveAttribute('target', '_blank');
  });

  it('includes trust center external link', () => {
    render(<Footer />);
    const trustCenterLink = screen.getByText('Trust Center').closest('a');
    expect(trustCenterLink).toHaveAttribute(
      'href',
      'https://toddagriscience.safebase.us'
    );
    expect(trustCenterLink).toHaveAttribute('target', '_blank');
  });
});
