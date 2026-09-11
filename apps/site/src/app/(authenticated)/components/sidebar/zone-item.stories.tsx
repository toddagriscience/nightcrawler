// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import ZoneItem from './zone-item';

const meta = {
  title: 'Authenticated/Sidebar/ZoneItem',
  component: ZoneItem,
  tags: ['autodocs'],
} satisfies Meta<typeof ZoneItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { id: 7, name: 'North Block', index: 0 },
};

export const Pending: Story = {
  args: { id: 8, name: 'Orcutt 6', index: 1, isPending: true },
};
