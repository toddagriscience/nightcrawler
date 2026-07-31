// Copyright © Todd Agriscience, Inc. All rights reserved.

import enMessages from '@/messages/about/en.json';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { useReducedMotion } from 'framer-motion';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PillarsSection from './pillars-section';

const mockUseMediaQuery = vi.fn();

vi.mock('@/lib/hooks/useMediaQuery', () => ({
  default: () => mockUseMediaQuery(),
}));

const t = (key: string) =>
  key
    .split('.')
    .reduce<unknown>(
      (current, segment) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      enMessages.whoWeAre
    ) as string;

const PILLAR_HEADINGS = ['Soil', 'Growing', 'Water', 'Pests', 'Harvest'];

const expectFullContent = () => {
  expect(
    screen.getByRole('heading', { level: 2, name: 'Pillars' })
  ).toBeInTheDocument();

  for (const heading of PILLAR_HEADINGS) {
    expect(
      screen.getByRole('heading', { level: 3, name: heading })
    ).toBeInTheDocument();
  }

  // The title must never be an h1 — the page already renders exactly one.
  expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
};

describe('PillarsSection', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it('renders the static content shell before the media query resolves (SSR)', () => {
    mockUseMediaQuery.mockReturnValue(undefined);

    renderWithNextIntl(<PillarsSection t={t} />);

    // Content must be present even before the breakpoint is known — nothing
    // is withheld from the server HTML.
    expect(
      screen.getByRole('heading', { level: 2, name: 'Pillars' })
    ).toBeInTheDocument();
    expectFullContent();
  });

  it('renders the mobile layout with title, subtitle, and all five pillars', () => {
    mockUseMediaQuery.mockReturnValue(false);

    renderWithNextIntl(<PillarsSection t={t} />);

    expectFullContent();
    expect(screen.getByText(/Placeholder subtitle/i)).toBeInTheDocument();
  });

  it('renders the desktop layout with title and all five pillars', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderWithNextIntl(<PillarsSection t={t} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Pillars' })
    ).toBeInTheDocument();
    expectFullContent();
  });

  it('falls back to the static layout on desktop when reduced motion is preferred', () => {
    mockUseMediaQuery.mockReturnValue(true);
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const { container } = renderWithNextIntl(<PillarsSection t={t} />);

    // The static variant renders a <section> root; the scroll-driven desktop
    // variant renders a plain scroll-track div.
    expect(container.querySelector('section')).toBeInTheDocument();
    expectFullContent();
  });

  it('emits ring path coordinates at a fixed precision so SSR and client HTML match', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { container } = renderWithNextIntl(<PillarsSection t={t} />);

    const paths = Array.from(container.querySelectorAll('path'));
    expect(paths.length).toBeGreaterThan(0);

    // Math.sin/cos can differ in their trailing digits between Node and the
    // browser. Long decimal tails in the emitted attributes are the signature
    // of unrounded trig and cause hydration mismatches, so assert every
    // generated number stays within COORD_PRECISION (3) decimals.
    const numbers = paths.flatMap((path) => [
      ...(path.getAttribute('d') ?? '').matchAll(/-?\d+\.(\d+)/g),
      ...(path.getAttribute('transform') ?? '').matchAll(/-?\d+\.(\d+)/g),
    ]);

    for (const match of numbers) {
      expect(match[1].length).toBeLessThanOrEqual(3);
    }
  });
});
