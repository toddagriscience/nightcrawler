// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import SidebarZoneList from './sidebar-zone-list';

const meta = {
  title: 'Authenticated/Sidebar/ZoneList',
  component: SidebarZoneList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[256px]">
        <Story />
      </div>
    ),
  ],
  args: {
    zones: [
      { id: 90, name: 'Apricot Block', isPending: false },
      { id: 27, name: 'Cherry Block', isPending: true },
    ],
    defaultZoneId: 27,
  },
} satisfies Meta<typeof SidebarZoneList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultZone: Story = {};

export const SelectedZone: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/', query: { zone: '90' } } },
  },
};

export const OtherRoute: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/reminders' } },
  },
};
