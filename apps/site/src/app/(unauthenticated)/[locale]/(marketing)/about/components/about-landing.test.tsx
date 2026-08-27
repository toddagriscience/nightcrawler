// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import AboutLanding from './about-landing';

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

vi.mock('./competencies-section/competencies-section', () => ({
  default: () => <div data-testid="competencies-section">Competencies</div>,
}));

vi.mock('./responsibilities-section/responsibilities-section', () => ({
  default: () => (
    <div data-testid="responsibilities-section">Responsibilities</div>
  ),
}));

describe('AboutLanding', () => {
  it('renders exactly one h1 element with the correct title for accessibility', () => {
    renderWithNextIntl(<AboutLanding />);

    const h1Elements = screen.getAllByRole('heading', { level: 1 });

    expect(h1Elements).toHaveLength(1);

    expect(h1Elements[0]).toHaveTextContent('About');
  });

  it('renders the hero content', () => {
    renderWithNextIntl(<AboutLanding />);

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();

    expect(screen.getByText('Company')).toBeInTheDocument();

    expect(
      screen.getAllByText(
        /We believe sustainable agriculture is the foundation/i
      )
    ).not.toHaveLength(0);
  });

  it('renders vision section with image and CTA', () => {
    renderWithNextIntl(<AboutLanding />);

    expect(
      screen.getByRole('heading', {
        name: /Our vision for the future\s+of agriculture/i,
      })
    ).toBeInTheDocument();

    const cta = screen.getByRole('link', { name: /Our research/i });
    expect(cta).toBeInTheDocument();
    expect(cta.querySelector('svg')).not.toBeNull();
  });

  it('renders the vision image from the kebab-case asset at the slot it occupies', () => {
    renderWithNextIntl(<AboutLanding />);

    const image = screen.getByRole('img', { name: /family/i });

    expect(image).toHaveAttribute('src', '/marketing/about-family.jpg');
    // The slot is `max-w-[580px]`. Understating it makes the srcset picker choose
    // one candidate too small and the photo softens on desktop.
    expect(image).toHaveAttribute('sizes', '(min-width: 768px) 580px, 100vw');
  });

  it('captions the header photo without repeating its alt text', () => {
    const { container } = renderWithNextIntl(<AboutLanding />);

    const caption = screen.getByText('Image: Partner Farm in Grass Valley, CA');
    expect(caption.tagName).toBe('FIGCAPTION');

    const image = container.querySelector(
      'img[src="/marketing/who-we-are-header.webp"]'
    );
    expect(image).not.toBeNull();
    expect(caption.closest('figure')).toContainElement(
      image as HTMLElement | null
    );

    // The alt used to be the hardcoded, untranslated "Meadow". It describes the
    // photo; the caption says where it was taken. Neither should restate the
    // other, or the image is announced twice.
    expect(image).toHaveAttribute(
      'alt',
      'A grass path winding between fruit trees on a partner farm'
    );
  });

  it('never skips a heading level', () => {
    renderWithNextIntl(<AboutLanding />);

    const levels = screen
      .getAllByRole('heading')
      .map((heading) => Number(heading.tagName.slice(1)));

    // The hero tagline used to be an <h3> directly under the <h1>, so the vision
    // section's <h2> produced h1 -> h3 -> h2: a skip, then a step backwards.
    expect(levels[0]).toBe(1);
    for (const [index, level] of levels.slice(1).entries()) {
      expect(level - levels[index]).toBeLessThanOrEqual(1);
    }
  });

  it('renders the mission statement', () => {
    renderWithNextIntl(<AboutLanding />);

    expect(
      screen.getByText(/We are creating generative farms/i)
    ).toBeInTheDocument();
  });

  it('renders partners section', () => {
    renderWithNextIntl(<AboutLanding />);

    expect(
      screen.getByRole('heading', { name: 'Backed by incredible partners' })
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'USDA' })).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Biodynamic Demeter Alliance' })
    ).toBeInTheDocument();
  });

  it('renders navigation link to What We Do', () => {
    renderWithNextIntl(<AboutLanding />);

    expect(
      screen.getByRole('link', { name: /What we do/i })
    ).toBeInTheDocument();
  });
});
