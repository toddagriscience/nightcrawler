// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import {
  PH_DISPLAY_MAX,
  PH_DISPLAY_MIN,
  PH_TICKS,
  type PhRangeModel,
} from './to-ph-range';

/** Matches `bg-foreground/15` as an SVG fill, same hex style as Calcium. */
const BAND_FILL = '#2a272726';

/** Matches `bg-emerald-700/45` as an SVG fill. */
const TARGET_FILL = '#04785773';

/** Same scatter fill as `MineralLevelWidget`. */
const MARKER_FILL = '#0A0A0A';

const PH_DISPLAY_SPAN = PH_DISPLAY_MAX - PH_DISPLAY_MIN;

/** Props for the farmer-facing pH range indicator. */
export type ZonePhRangeProps = PhRangeModel;

function percentToSpan(percent: number): number {
  return (percent / 100) * PH_DISPLAY_SPAN;
}

function buildAriaLabel(model: PhRangeModel): string {
  if (!model.target) {
    return `${model.displayValue}. ${model.statusLabel}.`;
  }

  return `${model.displayValue}. ${model.statusLabel}. Target range ${model.target.low} to ${model.target.high}. More acidic below target, more alkaline above target.`;
}

function PhMarker({
  cx,
  cy,
  plotted,
}: {
  cx?: number;
  cy?: number;
  plotted: number;
}) {
  if (cx == null || cy == null) {
    return null;
  }

  return (
    <circle
      data-testid="ph-range-marker"
      data-plotted={plotted}
      cx={cx}
      cy={cy}
      r={4}
      fill={MARKER_FILL}
    />
  );
}

/**
 * Fixed 5.5–8.0 pH range with an optional farm target band and current-reading
 * marker. Uses the same Recharts axis overlay as MineralLevelWidget so the
 * line and ticks match Calcium.
 *
 * @param {ZonePhRangeProps} props - Mapped pH range view model.
 * @returns {React.ReactNode} The pH range indicator.
 */
export function ZonePhRange(model: ZonePhRangeProps) {
  const ariaLabel = buildAriaLabel(model);
  const plottedX = percentToSpan(model.markerPercent);
  const plottedPh = PH_DISPLAY_MIN + plottedX;
  const xAxisDomain = [0, PH_DISPLAY_SPAN];
  const chartData = [{ x: plottedX, y: 0 }];

  const bars = [
    {
      name: 'range',
      acidic: model.segments
        ? percentToSpan(model.segments.acidicPercent)
        : PH_DISPLAY_SPAN,
      target: model.segments ? percentToSpan(model.segments.targetPercent) : 0,
      alkaline: model.segments
        ? percentToSpan(model.segments.alkalinePercent)
        : 0,
    },
  ];

  return (
    <div>
      <p className="text-foreground text-sm font-medium">pH</p>
      <div
        className="mt-4 grid h-16 grid-cols-1 grid-rows-1 place-items-center justify-items-center"
        role="img"
        aria-label={ariaLabel}
      >
        <ChartContainer
          config={{}}
          className="col-start-1 row-start-1 mb-10 h-full w-full"
        >
          <BarChart className="w-full" layout="vertical" data={bars}>
            <XAxis hide type="number" domain={xAxisDomain} />
            <YAxis type="category" dataKey="name" hide />
            <Bar dataKey="acidic" stackId="a" fill={BAND_FILL} barSize={22} />
            <Bar dataKey="target" stackId="a" fill={TARGET_FILL} barSize={22} />
            <Bar dataKey="alkaline" stackId="a" fill={BAND_FILL} barSize={22} />
          </BarChart>
        </ChartContainer>
        <ChartContainer
          config={{}}
          className="col-start-1 row-start-1 h-full w-full"
        >
          <ScatterChart className="w-full" layout="horizontal" data={chartData}>
            <XAxis
              dataKey="x"
              type="number"
              interval="preserveStartEnd"
              domain={xAxisDomain}
              ticks={PH_TICKS.map((tick) => tick - PH_DISPLAY_MIN)}
              tickFormatter={(value: number) =>
                (Number(value) + PH_DISPLAY_MIN).toFixed(1)
              }
            />
            <YAxis dataKey="y" hide type="number" domain={[0, 1]} />
            <Scatter
              dataKey="x"
              fill={MARKER_FILL}
              shape={(props: { cx?: number; cy?: number }) => (
                <PhMarker cx={props.cx} cy={props.cy} plotted={plottedPh} />
              )}
            />
          </ScatterChart>
        </ChartContainer>
      </div>
      <p className="mt-3 text-sm">
        <span className="text-foreground/60">{model.statusLabel}</span>
        {' · '}
        <span className="text-foreground">{model.displayValue}</span>
      </p>
    </div>
  );
}
