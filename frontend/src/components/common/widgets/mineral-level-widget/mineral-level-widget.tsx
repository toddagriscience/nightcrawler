// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Bar, ComposedChart, Scatter, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';

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
  const thirdsSizing = max / 3;
  const chartData = [
    { y: 0.5, x: 10 },
    { y: 0.5, x: 15 },
  ];
  const barChartData = [
    {
      category: 'row1',
      low: thirdsSizing,
      medium: thirdsSizing,
      high: thirdsSizing,
    },
  ];
  const xAxisDomain = [0, max];
  const yAxisDomain = [0, max];

  return (
    <div className="">
      <div className="mb-4">
        <h4 className="text-sm font-medium">Mineral Distribution</h4>
        <p className="text-xs text-muted-foreground">
          Current levels across categories
        </p>
      </div>
      <div className="grid grid-cols-1 grid-rows-1">
        <ChartContainer
          config={chartConfig}
          className="h-8 w-full col-start-1 row-start-1 z-0"
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
              barSize={12}
            />
            <Bar
              dataKey="medium"
              stackId="a"
              fill="var(--color-medium)"
              barSize={12}
            />
            <Bar
              dataKey="high"
              stackId="a"
              fill="var(--color-high)"
              barSize={12}
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
            <YAxis dataKey={'y'} hide type="number" range={[0, 1]} />
            <Scatter data={chartData} dataKey={'x'} />
            <Tooltip />
          </ComposedChart>
        </ChartContainer>
      </div>
    </div>
  );
}
