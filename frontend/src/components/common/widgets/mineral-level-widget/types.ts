// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ChartConfig } from '@/components/ui/chart';

export type MineralChartType = {
  y: number;
  x: number;
  realValue: number;
  date: Date;
  unit: string;
};

export type MineralLevelWidgetProps = {
  max: number;
  min: number;
  chartData: MineralChartType[];
  /**
   *
   * x-----low-------ideal--------high-------max
   * | low  |   ideal  |          high        |
   */
  standards: { low: number; ideal: number; high: number };
  chartConfig?: ChartConfig;
};
