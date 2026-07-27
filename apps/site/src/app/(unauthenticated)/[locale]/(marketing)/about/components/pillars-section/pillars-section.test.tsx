// Copyright © Todd Agriscience, Inc. All rights reserved.

import enMessages from '@/messages/about/en.json';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import PillarsSection from './pillars-section';

const mockUseWindowWidth = vi.fn();

vi.mock('@/lib/hooks/useWindowWidth', () => ({
  default: () => mockUseWindowWidth(),
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

describe('PillarsSection', () => {
  it('renders nothing until window width is known', () => {
    mockUseWindowWidth.mockReturnValue(undefined);

    const { container } = renderWithNextIntl(<PillarsSection t={t} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the mobile layout with title, subtitle, and all five pillars', () => {
    mockUseWindowWidth.mockReturnValue(500);

    renderWithNextIntl(<PillarsSection t={t} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Pillars' })
    ).toBeInTheDocument();

    expect(screen.getByText(/Placeholder subtitle/i)).toBeInTheDocument();

    for (const heading of PILLAR_HEADINGS) {
      expect(
        screen.getByRole('heading', { level: 3, name: heading })
      ).toBeInTheDocument();
    }

    // The title must never be an h1 — the page already renders exactly one.
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('renders the desktop layout with title and all five pillars', () => {
    mockUseWindowWidth.mockReturnValue(1440);

    renderWithNextIntl(<PillarsSection t={t} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Pillars' })
    ).toBeInTheDocument();

    for (const heading of PILLAR_HEADINGS) {
      expect(
        screen.getByRole('heading', { level: 3, name: heading })
      ).toBeInTheDocument();
    }

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});
