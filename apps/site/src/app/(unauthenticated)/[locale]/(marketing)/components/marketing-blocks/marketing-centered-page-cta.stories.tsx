// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarketingCenteredPageCta } from './marketing-centered-page-cta';

const meta = {
  title: 'Marketing/CenteredPageCta',
  component: MarketingCenteredPageCta,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    heading: 'Shape the future of agriculture',
    ctaLabel: 'View careers',
    ctaHref: '/careers/search',
    sectionId: 'careers-footer-cta',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MarketingCenteredPageCta>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closing band as used on `/careers`. */
export const Default: Story = {};

/** Closing band as used on `/about`. */
export const About: Story = {
  args: {
    heading: 'What we do',
    ctaLabel: 'Explore our research',
    ctaHref: '/research',
    sectionId: 'about-footer-cta',
  },
};

/** Closing band as used on `/research`. */
export const Research: Story = {
  args: {
    heading: 'Build a better farm',
    ctaLabel: 'Meet Iris',
    ctaHref: '/index/introducing-iris',
    sectionId: 'research-footer-cta',
  },
};

/** Longer headline, to check the 48px desktop size wraps cleanly. */
export const LongHeading: Story = {
  args: {
    heading: 'Agriculture that heals the planet and supports communities',
  },
};
