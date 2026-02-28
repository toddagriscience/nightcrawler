// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ChartConfig } from '@/components/ui/chart';

/** Standard range values for a single macro nutrient, sourced from the `standard_values` table. */
export type MacroRange = {
  low: number;
  ideal: number;
  max: number;
};

/** A single data point on the radar chart, after normalization. */
export type MacroRadarDataPoint = {
  /** Display name of the macro (e.g. "Calcium") */
  macro: string;
  /** Normalized value (50 = low, 100 = midpoint(low, ideal), 150 = max) */
  normalized: number;
  /** The raw/actual reading value before normalization */
  rawValue: number | null;
  /** The unit of measurement (e.g. "ppm", "%") */
  unit: string;
};

export type MacroRadarWidgetProps = {
  /** Normalized radar data for each macro nutrient */
  data: MacroRadarDataPoint[];
  /** Optional chart config for theming */
  chartConfig?: ChartConfig;
};
