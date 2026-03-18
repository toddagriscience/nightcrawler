// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import WhatWeDoPage from './page';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string | { src: string };
    alt: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : src.src} alt={alt} {...props} />
  ),
}));

describe('WhatWeDoPage', () => {
  it('renders the hero content', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(
      screen.getByRole('heading', {
        name: "We support the world's most important farms",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Our research reveals insights unimagined by others and move swiftly to regenerate soil. We work with farms who have displayed a commitment to ecologically and socially responsible management practices and forged deep emotional connections with their target consumers.'
      )
    ).toBeInTheDocument();
  });

  it('renders approach and strategy sections', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(
      screen.getByRole('heading', { name: 'Our Approach' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Five Principles. One Strategy.' })
    ).toBeInTheDocument();
  });

  it('renders principle cards', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(
      screen.getByText('Advanced Research with Disciplined Data Selection')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Data-Driven Crop Production and Produce Safety')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Operation Management Across Different Farming Categories'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('NOP and Demeter Integrity')).toBeInTheDocument();
    expect(
      screen.getByText('Market Entry & Consumer Awareness')
    ).toBeInTheDocument();
  });

  it('renders redefining agriculture cards and CTA', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    expect(
      screen.getByRole('heading', {
        name: 'Seeking Sustainability. Redefining Agriculture.',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Firm Representation')).toBeInTheDocument();
    expect(screen.getByText('Team Focus')).toBeInTheDocument();
    expect(
      screen.getByText('Farm Alignment and Integration')
    ).toBeInTheDocument();
    expect(screen.getByText('Broader Communities')).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Build a better farm' })
    ).toBeInTheDocument();
  });

  it('renders exactly one h1 element with the correct title for accessibility', () => {
    renderWithNextIntl(<WhatWeDoPage />);

    const h1Elements = screen.getAllByRole('heading', { level: 1 });

    expect(h1Elements).toHaveLength(1);

    expect(h1Elements[0]).toHaveTextContent(
      "We support the world's most important farms"
    );
  });
});
