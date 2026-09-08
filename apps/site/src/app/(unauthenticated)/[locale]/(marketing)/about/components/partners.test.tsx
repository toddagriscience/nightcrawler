// Copyright © Todd Agriscience, Inc. All rights reserved.

import enMessages from '@/messages/about/en.json';
import esMessages from '@/messages/about/es.json';
import { act, renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Partners from './partners';

const mockUseMediaQuery = vi.fn();

vi.mock('@/lib/hooks/useMediaQuery', () => ({
  default: () => mockUseMediaQuery(),
}));

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

const GROUP_ONE_NAMES = [
  'USDA',
  'The Farmlink Project',
  'Whole Foods Market',
  'New Mexico State University',
  'Biodynamic Demeter Alliance',
  'CCOF Foundation',
];

const GROUP_TWO_NAMES = [
  'Organic Farmers Association',
  'Why Regenerative',
  'Center for Food Safety',
  'Cornell CALS',
];

const expectStaticContent = () => {
  for (const name of [...GROUP_ONE_NAMES, ...GROUP_TWO_NAMES]) {
    expect(screen.getByRole('img', { name })).toBeInTheDocument();
  }
  expect(
    screen.getByText(enMessages.whoWeAre.partners.tagline['0'])
  ).toBeInTheDocument();
  expect(
    screen.getByText(enMessages.whoWeAre.partners.tagline['1'])
  ).toBeInTheDocument();
};

describe('Partners', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows every logo and the tagline before the media query resolves (SSR)', () => {
    mockUseMediaQuery.mockReturnValue(undefined);

    renderWithNextIntl(<Partners />);

    // Nothing is withheld from the server HTML: crawlers and screen readers
    // get the full partner list even though the client later rotates it.
    expectStaticContent();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("labels every logo in the first rotation group with its organization's name", () => {
    renderWithNextIntl(<Partners />);

    for (const name of GROUP_ONE_NAMES) {
      expect(screen.getByRole('img', { name })).toBeInTheDocument();
    }
  });

  it('rotates to the second group and labels those logos', () => {
    renderWithNextIntl(<Partners />);

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    // Exact-name queries pin the corrected organization names: the logos read
    // "Organic Farmers Association" and "Why Regenerative", not the previous
    // "Organic Farming Association" / "Why Regenerative Agriculture".
    for (const name of GROUP_TWO_NAMES) {
      expect(screen.getByRole('img', { name })).toBeInTheDocument();
    }
    expect(screen.queryByRole('img', { name: 'USDA' })).not.toBeInTheDocument();
  });

  it('renders the closing tagline from the message catalog', () => {
    renderWithNextIntl(<Partners />);

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(
      screen.getByText(enMessages.whoWeAre.partners.tagline['0'])
    ).toBeInTheDocument();
    expect(
      screen.getByText(enMessages.whoWeAre.partners.tagline['1'])
    ).toBeInTheDocument();
  });

  it('translates the tagline in the Spanish catalog', () => {
    // The test harness always resolves English messages, so the Spanish copy
    // is pinned at the catalog level: the keys must exist, hold text, and not
    // repeat the English strings that used to be hard-coded in the component.
    expect(esMessages.whoWeAre.partners.tagline['0']).toBeTruthy();
    expect(esMessages.whoWeAre.partners.tagline['1']).toBeTruthy();
    expect(esMessages.whoWeAre.partners.tagline).not.toEqual(
      enMessages.whoWeAre.partners.tagline
    );
  });

  it('shows every logo statically and never rotates when reduced motion is preferred', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderWithNextIntl(<Partners />);

    expectStaticContent();

    // No rotation interval is scheduled, so nothing auto-updates.
    expect(vi.getTimerCount()).toBe(0);
  });

  it('stops rotating live when reduced motion is enabled mid-session', () => {
    const { rerender } = renderWithNextIntl(<Partners />);

    expect(vi.getTimerCount()).toBe(1);

    mockUseMediaQuery.mockReturnValue(true);
    rerender(<Partners />);

    expectStaticContent();
    expect(vi.getTimerCount()).toBe(0);
  });
});
