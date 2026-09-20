// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import MineralLevelWidget from './mineral-level-widget';
import type { MineralChartType, MineralLevelWidgetProps } from './types';

/**
 * Builds a chart point. When `clampedTo` is set, `x` is the plotted position
 * and `realValue` stays the raw reading — the tooltip then flags min/max
 * overflow, matching `getMineralLevelWidgetData`.
 */
function chartPoint(
  value: number,
  date: string,
  unit: string,
  clampedTo?: number
): MineralChartType {
  return {
    y: 0,
    x: clampedTo ?? value,
    realValue: value,
    date: new Date(date),
    unit,
  };
}

/** Default farm calcium thresholds from `standard_values`. */
const calciumArgs = {
  min: 0,
  max: 200.4,
  standards: { low: 100.2, ideal: 150.3, high: 200.4 },
  chartData: [
    chartPoint(72, '2024-03-15', 'ppm'),
    chartPoint(128, '2024-09-15', 'ppm'),
    chartPoint(168, '2025-03-15', 'ppm'),
    chartPoint(148, '2025-09-15', 'ppm'),
  ],
} satisfies MineralLevelWidgetProps;

const meta = {
  title: 'Common/Widgets/MineralLevelWidget',
  component: MineralLevelWidget,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Horizontal Low / Ideal / High range with scatter readings overlaid. Thresholds come from `standard_values`; readings come from analysis minerals. Hover a point for date, value, and min/max clamp notices.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[32rem] rounded-md border border-foreground/10 bg-background p-6">
        <Story />
      </div>
    ),
  ],
  args: calciumArgs,
  tags: ['autodocs'],
} satisfies Meta<typeof MineralLevelWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Calcium: Story = {};

export const PH: Story = {
  args: {
    min: 5.5,
    max: 8.5,
    standards: { low: 7.3, ideal: 7.55, high: 7.8 },
    chartData: [
      chartPoint(6.5, '2024-03-15', 'pH'),
      chartPoint(7.4, '2024-09-15', 'pH'),
      chartPoint(7.6, '2025-03-15', 'pH'),
    ],
  },
};

export const OrganicMatterAboveMax: Story = {
  args: {
    min: 0,
    max: 3,
    standards: { low: 1, ideal: 2, high: 3 },
    chartData: [
      chartPoint(1.8, '2024-09-15', '%'),
      chartPoint(3.2, '2025-03-15', '%', 3),
    ],
  },
};

export const BelowMin: Story = {
  args: {
    min: 50,
    max: 200.4,
    standards: { low: 100.2, ideal: 150.3, high: 200.4 },
    chartData: [chartPoint(20, '2025-09-15', 'ppm', 50)],
  },
};
