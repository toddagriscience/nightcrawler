// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Disclaimer } from './disclaimer';

const meta = {
  title: 'Common/Disclaimer',
  component: Disclaimer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    translationLoc: {
      control: { type: 'text' },
      description: 'Message namespace containing numbered disclaimers',
    },
    disclaimerCount: {
      control: { type: 'number', min: 1, max: 10 },
    },
    links: {
      control: { type: 'object' },
      description: 'Rich-text tag name → href map available to the messages',
    },
    className: {
      control: { type: 'text' },
    },
  },
  args: {
    translationLoc: 'careers.disclaimers',
    disclaimerCount: 5,
    links: {
      inquiry: '/contact',
      coverage:
        'https://transparency-in-coverage.collectivehealth.com/index.html',
      privacy: '/privacy',
    },
  },
} satisfies Meta<typeof Disclaimer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Careers legal disclosures: the accommodation notice links to the inquiry form, the
 * Transparency in Coverage reference opens externally, and Privacy Policy is internal.
 */
export const Careers: Story = {};

/** Research disclosures — plain paragraphs, no rich-text links. */
export const Research: Story = {
  args: {
    translationLoc: 'whatWeDo.disclaimers',
    disclaimerCount: 5,
    links: {},
  },
};

/** Flush layout override used inside constrained marketing containers. */
export const FlushWidth: Story = {
  args: {
    className: 'mb-0 w-full max-w-none',
  },
};
