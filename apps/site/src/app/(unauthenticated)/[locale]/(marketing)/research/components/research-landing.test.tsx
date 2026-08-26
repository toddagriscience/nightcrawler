// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import ResearchLanding from './research-landing';

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

describe('ResearchLanding', () => {
  it('renders the hero content', () => {
    renderWithNextIntl(<ResearchLanding />);

    expect(
      screen.getByRole('heading', {
        name: 'A holistic approach to agriculture',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'We believe sustainable agriculture is the foundation of a healthy planet and thriving communities.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getByAltText('Meadow')).toHaveAttribute(
      'src',
      '/marketing/meadow-4.webp'
    );
    expect(
      screen.getByRole('link', { name: 'View research index' })
    ).toHaveAttribute('href', '/research/index');
  });

  it('renders approach and strategy sections', () => {
    renderWithNextIntl(<ResearchLanding />);

    expect(
      screen.getByRole('heading', { name: 'Our Approach' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Five Principles. One Strategy.' })
    ).toBeInTheDocument();
  });

  it('renders principle cards', () => {
    renderWithNextIntl(<ResearchLanding />);

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
    renderWithNextIntl(<ResearchLanding />);

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
      screen.getByRole('heading', { level: 2, name: 'Build a better farm' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Meet Iris' })).toHaveAttribute(
      'href',
      '/index/introducing-iris'
    );
  });

  it('renders exactly one h1 element with the correct title for accessibility', () => {
    renderWithNextIntl(<ResearchLanding />);

    const h1Elements = screen.getAllByRole('heading', { level: 1 });

    expect(h1Elements).toHaveLength(1);

    expect(h1Elements[0]).toHaveTextContent(
      'A holistic approach to agriculture'
    );
  });
});
