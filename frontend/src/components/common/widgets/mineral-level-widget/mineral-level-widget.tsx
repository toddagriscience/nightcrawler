// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { MineralLevelWidgetProps } from './types';
import MetricRangeTooltip from './metric-range-tooltip';

/** Mineral level widget. Displays levels for minerals.
 *
 * @param children - The scale behind the horizontal lines. Used for user experience. */
export default function MineralLevelWidget({
  max,
  min,
  chartData,
  chartConfig = {},
  children,
}: MineralLevelWidgetProps) {
  // Ex. ph values, min = 0, max = 14
  const xAxisDomain = [min, max];

  // Intentionally constant, used for balancing
  const yAxisDomain = [0, 1];

  // Strip non-numeric fields so Recharts/Decimal.js doesn't choke on them
  const numericData = chartData.map(({ x, y }) => ({ x, y }));

  return (
    <div>
      <div className="mt-4 grid h-16 grid-cols-1 grid-rows-1 place-items-center justify-items-center">
        {children}
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
