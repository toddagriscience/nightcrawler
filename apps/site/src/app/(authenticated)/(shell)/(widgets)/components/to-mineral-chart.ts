// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { MineralLevelWidgetProps } from '@/components/common/widgets/mineral-level-widget/types';

/** Farm standard-value thresholds for one mineral. */
export interface MineralThresholds {
  /** Visual and clamp minimum. */
  min: number;
  /** Low-band boundary. */
  low: number;
  /** Ideal-band boundary. */
  ideal: number;
  /** High-band boundary. */
  high: number;
  /** Visual and clamp maximum. */
  max: number;
}

/** Minerals the zone dashboard still charts with MineralLevelWidget. */
export type ZoneChartMineral = 'Calcium';

/** Display units that differ from the stored `units` column. */
const UNIT_OVERRIDES: Record<ZoneChartMineral, string> = {
  Calcium: 'ppm',
};

function clamp(value: number, min: number, max: number): number {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

/**
 * Maps a single latest-analysis reading onto MineralLevelWidget props.
 * Returns null when farm standards are missing so the chart can be omitted.
 *
 * @param {object} input - Reading and thresholds.
 * @param {ZoneChartMineral} input.name - Mineral type, used for unit overrides.
 * @param {number} input.realValue - Unclamped lab reading.
 * @param {Date} input.date - Analysis date shown in the tooltip.
 * @param {string} input.storedUnit - Unit from the mineral row.
 * @param {MineralThresholds | null} input.thresholds - Farm standard values.
 * @returns {MineralLevelWidgetProps | null} Widget props, or null.
 */
export function toMineralChartProps({
  name,
  realValue,
  date,
  storedUnit,
  thresholds,
}: {
  name: ZoneChartMineral;
  realValue: number;
  date: Date;
  storedUnit: string;
  thresholds: MineralThresholds | null;
}): MineralLevelWidgetProps | null {
  if (!thresholds) {
    return null;
  }

  const { min, low, ideal, high, max } = thresholds;
  const x = clamp(realValue, min, max);

  return {
    min,
    max,
    standards: { low, ideal, high },
    chartData: [
      {
        y: 0,
        x,
        realValue,
        date,
        unit: UNIT_OVERRIDES[name] ?? storedUnit,
      },
    ],
  };
}
