// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ChartConfig } from '@/components/ui/chart';

export type MineralChartType = {
  y: number;
  x: number;
  date: Date;
  unit: string;
};

export type MineralLevelWidgetProps = {
  max: number;
  min: number;
  chartData: MineralChartType[];
  chartConfig?: ChartConfig;
  children?: React.ReactNode;
};
