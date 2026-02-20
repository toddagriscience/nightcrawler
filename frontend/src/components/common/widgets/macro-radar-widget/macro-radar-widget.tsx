// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts';
import { MacroRadarWidgetProps } from './types';

/** The default chart config for the macro radar, mapping the "normalized" data key to a themed color. */
const defaultChartConfig = {
  normalized: {
    label: 'Level',
    color: 'hsl(142, 71%, 45%)',
  },
};

/**
 * Radar chart widget for visualizing macro nutrient levels (Calcium, Magnesium, Sodium, Potassium).
 *
 * All values are pre-normalized so that:
 * - 50% = at the low boundary
 * - 100% = midpoint between low and ideal
 * - 150% = at or above the max boundary
 *
 * @param data - Array of normalized macro data points
 * @param chartConfig - Optional ShadCN chart config for theming
 */
export default function MacroRadarWidget({
  data,
  chartConfig = defaultChartConfig,
}: MacroRadarWidgetProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto h-full w-full [&_.recharts-responsive-container]:!aspect-auto"
    >
      <RadarChart data={data}>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => {
                const raw = item.payload?.rawValue;
                const unit = item.payload?.unit ?? '';
                const label = raw !== null ? `${raw} ${unit}` : 'No data';
                return (
                  <span className="text-foreground text-xs">
                    {label} (normalized: {value}%)
                  </span>
                );
              }}
            />
          }
        />
        <PolarAngleAxis dataKey="macro" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 150]}
          tick={false}
          axisLine={false}
        />
        <PolarGrid gridType="polygon" />
        <Radar
          name="Level"
          dataKey="normalized"
          fill="var(--color-normalized)"
          fillOpacity={0.4}
          stroke="var(--color-normalized)"
          strokeWidth={2}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  );
}
