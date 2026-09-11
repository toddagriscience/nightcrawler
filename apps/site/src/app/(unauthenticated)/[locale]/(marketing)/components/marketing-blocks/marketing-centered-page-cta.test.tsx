// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { MarketingCenteredPageCta } from './marketing-centered-page-cta';

describe('MarketingCenteredPageCta', () => {
  it('renders the heading as an h2 with the CTA as a separate link', () => {
    renderWithNextIntl(
      <MarketingCenteredPageCta
        ctaHref="/careers/search"
        ctaLabel="View careers"
        heading="Shape the future of agriculture"
        sectionId="test-footer-cta"
      />
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Shape the future of agriculture',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View careers' })).toHaveAttribute(
      'href',
      '/careers/search'
    );
  });

  it('labels the section by its heading for assistive technology', () => {
    renderWithNextIntl(
      <MarketingCenteredPageCta
        ctaHref="/research"
        ctaLabel="Explore our research"
        heading="What we do"
        headingId="about-footer-cta-heading"
        sectionId="about-footer-cta"
      />
    );

    expect(
      screen.getByRole('region', { name: 'What we do' })
    ).toBeInTheDocument();
  });

  it('renders the label unlinked when the destination is not root-relative', () => {
    // `toSafeHref` rejects bare relative paths, so callers must pass `/…`.
    renderWithNextIntl(
      <MarketingCenteredPageCta
        ctaHref="index/introducing-iris"
        ctaLabel="Meet Iris"
        heading="Build a better farm"
      />
    );

    expect(screen.queryByRole('link', { name: 'Meet Iris' })).toBeNull();
    expect(screen.getByText('Meet Iris')).toBeInTheDocument();
  });
});
