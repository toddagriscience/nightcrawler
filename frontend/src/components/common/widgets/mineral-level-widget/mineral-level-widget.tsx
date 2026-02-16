// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { MineralChartType } from './types';
import MetricRangeTooltip from './metric-range-tooltip';

/** Mineral level widget. Displays levels for minerals.
 *
 * @param children - The scale behind the horizontal lines. Used for user experience. */
export default function MineralLevelWidget({
  children,
}: {
  children?: React.ReactNode;
}) {
  const chartConfig = {} satisfies ChartConfig;
  const max = 10;
  const min = 0;
  const unit = ' unit';

  // The actual data
  const chartData: MineralChartType[] = [
    { y: 0, x: 5, date: new Date(), unit },
    { y: 0, x: 8, date: new Date(), unit },
    { y: 0, x: 3, date: new Date(), unit },
    { y: 0, x: 4.33, date: new Date(), unit },
  ];

  // Ex. ph values, min = 0, max = 14
  const xAxisDomain = [min * 1.0, max * 1.0];

  // Intentionally constant, used for balancing
  const yAxisDomain = [0, 1];

  return (
    <div>
      <div className="mt-4 grid h-16 grid-cols-1 grid-rows-1 place-items-center justify-items-center">
        {children}
        <ChartContainer
          config={chartConfig}
          className="col-start-1 row-start-1 h-full w-full"
        >
          <ScatterChart className="w-full" layout="horizontal" data={chartData}>
            <XAxis
              type="number"
              interval={'preserveStartEnd'}
              allowDecimals
              domain={xAxisDomain}
              unit={unit}
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
