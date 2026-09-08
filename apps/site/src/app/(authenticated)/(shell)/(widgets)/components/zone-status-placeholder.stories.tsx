// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ZoneStatusPlaceholder } from './zone-status-placeholder';

const meta = {
  title: 'Authenticated/Zone/ZoneStatusPlaceholder',
  component: ZoneStatusPlaceholder,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ZoneStatusPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Rejected: Story = {
  args: {
    status: 'rejected',
  },
};
