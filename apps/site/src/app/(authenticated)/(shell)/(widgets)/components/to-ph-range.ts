// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Fixed visual pH domain. Never derived from the current reading. */
export const PH_DISPLAY_MIN = 5.5;

/** Fixed visual pH domain. Never derived from the current reading. */
export const PH_DISPLAY_MAX = 8.0;

/** Readable ticks across the farmer-facing pH scale. */
export const PH_TICKS = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0] as const;

const PH_DISPLAY_SPAN = PH_DISPLAY_MAX - PH_DISPLAY_MIN;

/** Farmer-facing comparison of a reading against the farm target band. */
export type PhRangeStatus = 'below' | 'within' | 'above' | 'unconfigured';

/** Painted target band, clamped to the 5.5–8.0 display domain. */
export interface PhRangeTarget {
  /** Farm `phLow` (unclamped). */
  low: number;
  /** Farm `phHigh` (unclamped). */
  high: number;
  /** Left edge of the painted band, 0–100. */
  startPercent: number;
  /** Width of the painted band, 0–100. */
  widthPercent: number;
}

/** Proportional widths of the three semantic sections. */
export interface PhRangeSegments {
  /** Share of the bar below the target band. */
  acidicPercent: number;
  /** Share of the bar inside the target band. */
  targetPercent: number;
  /** Share of the bar above the target band. */
  alkalinePercent: number;
}

/** View model for the zone pH range indicator. */
export interface PhRangeModel {
  /** Unclamped lab reading. */
  value: number;
  /** Farmer-facing value, e.g. `pH 7.4`. */
  displayValue: string;
  /** Marker position on the 5.5–8.0 domain, 0–100. */
  markerPercent: number;
  /** Fixed scale ticks. */
  ticks: readonly number[];
  /** Status relative to the farm target, or unconfigured. */
  status: PhRangeStatus;
  /** Status copy only, e.g. `Within target range`. */
  statusLabel: string;
  /** Combined status line, e.g. `Within target range · pH 7.4`. */
  statusLine: string;
  /** Painted target band, or null when the farm has no pH targets. */
  target: PhRangeTarget | null;
  /** Semantic section widths, or null when unconfigured. */
  segments: PhRangeSegments | null;
}

/**
 * Formats a soil pH reading for farmers. Always prefixes `pH` and never uses
 * ppm or the stored mineral `units` column.
 *
 * @param {number} value - Unclamped lab reading.
 * @returns {string} Display value such as `pH 7.4`.
 */
export function formatPhValue(value: number): string {
  return `pH ${value.toFixed(1)}`;
}

function clamp(value: number, min: number, max: number): number {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

function toPercent(value: number): number {
  const raw =
    ((clamp(value, PH_DISPLAY_MIN, PH_DISPLAY_MAX) - PH_DISPLAY_MIN) /
      PH_DISPLAY_SPAN) *
    100;
  return Math.round(raw * 100) / 100;
}

/**
 * Farm pH bound as stored or as returned by Drizzle (`numeric` is a string
 * at runtime).
 */
export type PhBoundInput = number | string | null;

/**
 * Coerces a farm pH bound from Drizzle/pg into a finite number.
 * Empty strings and non-numeric values stay unconfigured.
 *
 * @param {PhBoundInput} value - Farm `phLow` / `phHigh`, possibly a numeric string.
 * @returns {number | null} Parsed bound, or null when unavailable.
 */
export function parsePhBound(value: PhBoundInput): number | null {
  if (value === null || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getConfiguredTarget(
  phLow: PhBoundInput,
  phHigh: PhBoundInput
): { low: number; high: number } | null {
  const low = parsePhBound(phLow);
  const high = parsePhBound(phHigh);
  if (low === null || high === null || low > high) {
    return null;
  }

  return { low, high };
}

/**
 * Maps a latest-analysis pH reading onto a fixed 5.5–8.0 range indicator.
 * Farm `phLow` / `phHigh` paint the target band when both are present.
 *
 * @param {object} input - Reading and optional farm targets.
 * @param {number} input.value - Unclamped lab reading.
 * @param {PhBoundInput} input.phLow - Lower bound of the farm target range.
 * @param {PhBoundInput} input.phHigh - Upper bound of the farm target range.
 * @returns {PhRangeModel} View model for `ZonePhRange`.
 */
export function toPhRange({
  value,
  phLow,
  phHigh,
}: {
  value: number;
  phLow: PhBoundInput;
  phHigh: PhBoundInput;
}): PhRangeModel {
  const displayValue = formatPhValue(value);
  const markerPercent = toPercent(value);
  const configured = getConfiguredTarget(phLow, phHigh);

  if (!configured) {
    return {
      value,
      displayValue,
      markerPercent,
      ticks: PH_TICKS,
      status: 'unconfigured',
      statusLabel: 'Target range not configured',
      statusLine: `Target range not configured · ${displayValue}`,
      target: null,
      segments: null,
    };
  }

  const startPercent = toPercent(configured.low);
  const endPercent = toPercent(configured.high);
  const widthPercent = endPercent - startPercent;

  let status: Exclude<PhRangeStatus, 'unconfigured'>;
  let statusLabel: string;
  if (value < configured.low) {
    status = 'below';
    statusLabel = 'Below target range';
  } else if (value > configured.high) {
    status = 'above';
    statusLabel = 'Above target range';
  } else {
    status = 'within';
    statusLabel = 'Within target range';
  }

  return {
    value,
    displayValue,
    markerPercent,
    ticks: PH_TICKS,
    status,
    statusLabel,
    statusLine: `${statusLabel} · ${displayValue}`,
    target: {
      low: configured.low,
      high: configured.high,
      startPercent,
      widthPercent,
    },
    segments: {
      acidicPercent: startPercent,
      targetPercent: widthPercent,
      alkalinePercent: 100 - endPercent,
    },
  };
}
