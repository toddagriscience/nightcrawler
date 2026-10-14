// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import PageHero from './page-hero';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('PageHero', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<PageHero title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    renderWithNextIntl(<PageHero title="Test Title" subtitle="My Subtitle" />);
    expect(screen.getByText('My Subtitle')).toBeInTheDocument();
  });

  it('does not render a subtitle when not provided', () => {
    renderWithNextIntl(<PageHero title="Test Title" />);
    // Try to find any element with the subtitle text
    const subtitleElement = screen.queryByText('My Subtitle');
    expect(subtitleElement).not.toBeInTheDocument();
  });

  it('displays the hero title as an h1 heading', () => {
    renderWithNextIntl(<PageHero title="About Us" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('About Us');
  });

  it('hides arrow when showArrow is false', () => {
    renderWithNextIntl(<PageHero title="Test Title" showArrow={false} />);
    const arrowIcon = screen.queryByTestId('page-hero-arrow');
    expect(arrowIcon).not.toBeInTheDocument();
  });

  it('keeps the decorative arrow at 24px independently of inherited text size', () => {
    renderWithNextIntl(<PageHero title="About Us" />);
    const arrowIcon = screen.getByTestId('page-hero-arrow');
    expect(arrowIcon).toHaveAttribute('width', '24');
    expect(arrowIcon).toHaveAttribute('height', '24');
    expect(arrowIcon).toHaveAttribute('stroke-width', '2');
    expect(arrowIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-hero-class';
    const { container } = renderWithNextIntl(
      <PageHero title="Test Title" className={customClass} />
    );
    const heroContainer = container.firstChild;
    expect(heroContainer).toHaveClass(customClass);
  });
});
