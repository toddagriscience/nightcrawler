// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchPanelProvider } from './search-panel-context';
import { SearchZoneContext } from './search-zone-context';

const meta = {
  title: 'Platform/Search/SearchZoneContext',
  component: SearchZoneContext,
  args: { zoneId: 12 },
  decorators: [
    (Story, context) => (
      <SearchPanelProvider>
        <Story />
        <p>Zone {context.args.zoneId} is registered for dashboard searches.</p>
      </SearchPanelProvider>
    ),
  ],
} satisfies Meta<typeof SearchZoneContext>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DashboardZone: Story = {};
