// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Bar, ComposedChart, Scatter, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

/** Mineral level widget. Displays levels for minerals */
export default function MineralLevelWidget() {
  const chartConfig = {
    low: {
      label: 'Low',
      color: '#ef4444', // red
    },
    medium: {
      label: 'Medium',
      color: '#f59e0b', // orange/amber
    },
    high: {
      label: 'High',
      color: '#10b981', // green
    },
  } satisfies ChartConfig;

  const max = 20;
  const min = 0;

  /**
   * 0        low       mid      high
   * |---------|---------|---------|
   */
  const low = 6.6;
  const medium = 13.3 - 6.6;
  const high = 20 - 13.3;

  // The actual data
  const chartData = [
    { y: 0.5, x: 10 },
    { y: 0.5, x: 15 },
  ];

  // Used for formatting the horizontal bars
  const barChartData = [
    {
      category: 'row1',
      low,
      medium,
      high,
    },
  ];

  // Ex. ph values, min = 0, max = 14
  const xAxisDomain = [min, max];

  // Intentionally constant, used for balancing
  const yAxisDomain = [0, 1];

  return (
    <div className="">
      <div className="mb-4">
        <h4 className="text-sm font-medium">Mineral Distribution</h4>
        <p className="text-xs text-muted-foreground">
          Current levels across categories
        </p>
      </div>
      <div className="grid grid-cols-1 max-h-8 grid-rows-1 place-items-center justify-items-center">
        <ChartContainer
          config={chartConfig}
          className="w-full col-start-1 row-start-1 z-0"
        >
          <ComposedChart
            className="w-full"
            layout="vertical"
            data={barChartData}
          >
            <XAxis hide type="number" domain={[0, 20]} />
            <YAxis hide type="category" dataKey="category" />
            <Bar
              dataKey="low"
              stackId="a"
              fill="var(--color-low)"
              barSize={16}
            />
            <Bar
              dataKey="medium"
              stackId="a"
              fill="var(--color-medium)"
              barSize={16}
            />
            <Bar
              dataKey="high"
              stackId="a"
              fill="var(--color-high)"
              barSize={16}
            />
          </ComposedChart>
        </ChartContainer>
        <ChartContainer
          config={chartConfig}
          className="h-8 w-full col-start-1 row-start-1 z-10"
        >
          <ComposedChart
            className="w-full"
            layout="horizontal"
            data={chartData}
          >
            <XAxis dataKey={'x'} hide type="number" domain={xAxisDomain} />
            <YAxis dataKey={'y'} hide type="number" domain={yAxisDomain} />
            <Scatter data={chartData} dataKey={'x'} />
            <Tooltip />
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  );
}
