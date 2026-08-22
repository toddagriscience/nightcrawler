// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import SocialLinks from './social-links';

const meta: Meta<typeof SocialLinks> = {
  title: 'Common/SocialLinks',
  component: SocialLinks,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable social media icon links for Todd, rendered from the shared SOCIAL_LINKS source of truth. Used by the marketing footer, the /go creators footer, and the 404 page so the URLs, labels, and icons live in one place.',
      },
    },
  },
  argTypes: {
    iconSize: { control: { type: 'number' } },
    newTab: { control: { type: 'boolean' } },
  },
  tags: ['autodocs'],
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
    newTab: true,
  },
};
