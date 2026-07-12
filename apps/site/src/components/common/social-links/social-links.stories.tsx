// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SocialLinks from './social-links';

const meta: Meta<typeof SocialLinks> = {
  title: 'Common/SocialLinks',
  component: SocialLinks,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable social media icon links for Todd, rendered from a shared source of truth. Used in the marketing and go footers so the URLs and labels live in one place.',
      },
    },
  },
  argTypes: {
    iconSize: { control: { type: 'number' } },
  },
};

export default meta;
type Story = StoryObj<typeof SocialLinks>;

export const AllPlatforms: Story = {};

export const MarketingFooter: Story = {
  args: {
    platforms: ['instagram', 'linkedin', 'x', 'youtube'],
  },
};

export const GoFooter: Story = {
  args: {
    platforms: ['x', 'instagram', 'linkedin', 'youtube', 'discord'],
    iconSize: 20,
  },
};
