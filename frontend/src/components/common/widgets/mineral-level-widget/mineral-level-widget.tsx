// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { ChartContainer } from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import MetricRangeTooltip from './metric-range-tooltip';
import { MineralLevelWidgetProps } from './types';

/** Mineral level widget. Displays levels for minerals.
 *
 * @param children - The scale behind the horizontal lines. Used for user experience. */
export default function MineralLevelWidget({
  max,
  min,
  chartData,
  chartConfig = {},
  standards,
}: MineralLevelWidgetProps) {
  // Ex. ph values, min = 0, max = 14
  const xAxisDomain = [Number(min), Number(max)];

  // Intentionally constant, used for balancing
  const yAxisDomain = [0, 1];

  // Strip non-numeric fields so Recharts/Decimal.js doesn't choke on them
  const numericData = chartData.map(({ x, y, date, realValue, unit }) => ({
    x,
    y,
    date,
    realValue,
    unit,
  }));

  const bars = [
    {
      name: 'range',
      low: Number(standards.low),
      ideal: Number(standards.ideal) - Number(standards.low),
      high: Number(standards.high) - Number(standards.ideal),
    },
  ];

  console.log(bars);

  return (
    <div>
      <div className="mt-4 grid h-16 grid-cols-1 grid-rows-1 place-items-center justify-items-center">
        <ChartContainer
          config={chartConfig}
          className="col-start-1 row-start-1 mb-8 h-full w-full"
        >
          <BarChart className="w-full" layout="vertical" data={bars}>
            <XAxis hide type="number" domain={xAxisDomain} />
            <YAxis type="category" dataKey="name" hide />
            <Bar dataKey="low" stackId="a" fill="#e6cd5590" barSize={12} />
            <Bar dataKey="ideal" stackId="a" fill="#35ba2380" barSize={12} />
            <Bar dataKey="high" stackId="a" fill="#e6cd5590" barSize={12} />
          </BarChart>
        </ChartContainer>
        <ChartContainer
          config={chartConfig}
          className="col-start-1 row-start-1 h-full w-full"
        >
          <ScatterChart
            className="w-full"
            layout="horizontal"
            data={numericData}
          >
            <XAxis
              dataKey="x"
              type="number"
              interval={'preserveStartEnd'}
              domain={xAxisDomain}
              unit={' ' + chartData[0].unit}
            />
            <YAxis dataKey={'y'} hide type="number" domain={yAxisDomain} />
            <Scatter dataKey={'x'} fill="#0A0A0A" />
            <Tooltip
              content={MetricRangeTooltip}
              cursor={false}
              isAnimationActive={false}
            />
          </ScatterChart>
        </ChartContainer>
      </div>
    </div>
  );
}
