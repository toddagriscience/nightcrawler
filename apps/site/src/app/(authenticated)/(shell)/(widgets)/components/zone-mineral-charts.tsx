// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import MineralLevelWidget from '@/components/common/widgets/mineral-level-widget/mineral-level-widget';
import type { MineralLevelWidgetProps } from '@/components/common/widgets/mineral-level-widget/types';

/** One labeled mineral chart on the zone dashboard. */
export interface ZoneMineralChart {
  /** Visible chart title, e.g. Calcium. */
  label: string;
  /** Props forwarded to MineralLevelWidget. */
  props: MineralLevelWidgetProps;
}

/** Props for the stacked mineral charts. */
export interface ZoneMineralChartsProps {
  /** Charts to render. Empty arrays render nothing. */
  charts: ZoneMineralChart[];
}

/**
 * Stacked MineralLevelWidget charts for the selected zone. pH uses
 * `ZonePhRange` instead.
 *
 * @param {ZoneMineralChartsProps} props - Component props.
 * @returns {React.ReactNode} The charts, or null.
 */
export function ZoneMineralCharts({ charts }: ZoneMineralChartsProps) {
  if (charts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      {charts.map((chart) => (
        <div key={chart.label}>
          <p className="text-foreground text-sm font-medium">{chart.label}</p>
          <MineralLevelWidget {...chart.props} />
        </div>
      ))}
    </div>
  );
}
