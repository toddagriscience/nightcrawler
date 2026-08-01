// Copyright © Todd Agriscience, Inc. All rights reserved.

import enMessages from '@/messages/about/en.json';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { useReducedMotion } from 'framer-motion';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CompetenciesSection from './competencies-section';

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

const expectFullContent = () => {
  expect(
    screen.getByRole('heading', {
      level: 2,
      name: /three core competencies/i,
    })
  ).toBeInTheDocument();

  for (const index of [0, 1, 2]) {
    expect(
      screen.getByText(t(`competencies.items.${index}`))
    ).toBeInTheDocument();
  }

  expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
};

describe('CompetenciesSection', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  it('renders the static content shell before the media query resolves (SSR)', () => {
    mockUseMediaQuery.mockReturnValue(undefined);

    renderWithNextIntl(<CompetenciesSection t={t} />);

    // Content must be present even before the breakpoint is known — nothing
    // is withheld from the server HTML.
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /three core competencies/i,
      })
    ).toBeInTheDocument();
    expectFullContent();
  });

  it('renders the mobile layout with all three competencies', () => {
    mockUseMediaQuery.mockReturnValue(false);

    renderWithNextIntl(<CompetenciesSection t={t} />);

    expect(screen.getByText(t('competencies.items.0'))).toBeInTheDocument();
    expectFullContent();
  });

  it('renders the desktop layout with all three competencies', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderWithNextIntl(<CompetenciesSection t={t} />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /three core competencies/i,
      })
    ).toBeInTheDocument();
    expectFullContent();
  });

  it('falls back to the static layout on desktop when reduced motion is preferred', () => {
    mockUseMediaQuery.mockReturnValue(true);
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const { container } = renderWithNextIntl(<CompetenciesSection t={t} />);

    expect(container.querySelector('section')).toBeInTheDocument();
    expectFullContent();
  });

  it('does not apply a hover background to the circles', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { container } = renderWithNextIntl(<CompetenciesSection t={t} />);

    expect(container.innerHTML).not.toContain('hover:bg-black/10');
  });
});
