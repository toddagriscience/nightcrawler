// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ChartConfig } from '@/components/ui/chart';

/** The type used to pass data into the `<MineralLevelWidget />` component. See MineralLevelWidgetProps for more context */
export type MineralChartType = {
  /** Constant, not needed for most charts. */
  y?: 0;
  /** Where the entry is horizontally. */
  x: number;
  /** The literal */
  realValue: number;
  /** The date this sample was taken */
  date: Date;
  /** The unit of the metric. Usually ppm. */
  unit: string;
};

export type MineralLevelWidgetProps = {
  /** The maximum value allowed *visually*. Usually the same as standards.high. Any entry higher than this is set to the max, and a notification is added to the respective tooltip. */
  max: number;
  /** The minimum value allowed *visually*. Any entry higher than this is set to the max, and a notification is added to the respective tooltip */
  min: number;
  /** The data to plot onto the chart. */
  chartData: MineralChartType[];
  /**
   * Usually taken from the `standard_values` table.
   *
   * x-----low-------ideal--------high-------max
   * | low  |   ideal  |          high        |
   */
  standards: { low: number; ideal: number; high: number };
  /** Empty, usually. */
  chartConfig?: ChartConfig;
};
