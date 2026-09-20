// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchPanelProvider } from '@/app/(authenticated)/components/search-panel/search-panel-context';
import type { MineralLevelWidgetProps } from '@/components/common/widgets/mineral-level-widget/types';
import { toPhRange } from './to-ph-range';
import { ZoneActiveTemplate } from './zone-active-template';
import { ZoneStatusPlaceholder } from './zone-status-placeholder';

const calciumProps: MineralLevelWidgetProps = {
  min: 0,
  max: 200.4,
  standards: { low: 100.2, ideal: 150.3, high: 200.4 },
  chartData: [
    {
      y: 0,
      x: 148,
      realValue: 148,
      date: new Date('2025-09-15'),
      unit: 'ppm',
    },
  ],
};

const phRange = toPhRange({
  value: 7.4,
  phLow: 7.3,
  phHigh: 7.8,
});

/**
 * Composed zone dashboard states. The live page is a server component that
 * loads analysis from the DB; these stories use the same presentational pieces
 * with mock props.
 */
function ZoneTemplatePreview({
  variant,
}: {
  variant: 'active' | 'pending' | 'rejected';
}) {
  if (variant === 'pending') {
    return <ZoneStatusPlaceholder status="pending" />;
  }

  if (variant === 'rejected') {
    return <ZoneStatusPlaceholder status="rejected" />;
  }

  return (
    <SearchPanelProvider>
      <ZoneActiveTemplate
        zoneName="North block"
        sampleLabel="September 15, 2025"
        nextLabel="March 15, 2026"
        charts={[{ label: 'Calcium', props: calciumProps }]}
        phRange={phRange}
        summary="Healthy baseline mineral profile for this management zone."
        action="Maintain calcium and organic matter; monitor salinity seasonally."
      />
    </SearchPanelProvider>
  );
}

const meta = {
  title: 'Authenticated/Zone/ZoneTemplate',
  component: ZoneTemplatePreview,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ZoneTemplatePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    variant: 'active',
  },
};

export const Pending: Story = {
  args: {
    variant: 'pending',
  },
};

export const Rejected: Story = {
  args: {
    variant: 'rejected',
  },
};
