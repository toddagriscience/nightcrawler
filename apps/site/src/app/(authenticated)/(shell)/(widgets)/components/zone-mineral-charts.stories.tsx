// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MineralLevelWidgetProps } from '@/components/common/widgets/mineral-level-widget/types';
import { ZoneMineralCharts } from './zone-mineral-charts';

const calciumInRange: MineralLevelWidgetProps = {
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

const calciumClamped: MineralLevelWidgetProps = {
  min: 0,
  max: 200.4,
  standards: { low: 100.2, ideal: 150.3, high: 200.4 },
  chartData: [
    {
      y: 0,
      x: 200.4,
      realValue: 1850,
      date: new Date('2025-09-15'),
      unit: 'ppm',
    },
  ],
};

const meta = {
  title: 'Authenticated/Zone/ZoneMineralCharts',
  component: ZoneMineralCharts,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[32rem] px-6">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ZoneMineralCharts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalciumOnly: Story = {
  args: {
    charts: [{ label: 'Calcium', props: calciumInRange }],
  },
};

export const ClampedAboveMax: Story = {
  args: {
    charts: [{ label: 'Calcium', props: calciumClamped }],
  },
};
