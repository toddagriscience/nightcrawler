// Copyright © Todd Agriscience, Inc. All rights reserved.

import { MacroRange } from './types';

/**
 * Normalizes a raw macro reading into a percentage based on standard value ranges.
 *
 * The normalization maps:
 * - `low` → 50%
 * - midpoint of `low` and `ideal` → 100%
 * - `max` → 150%
 *
 * Values below `low` are linearly extrapolated down toward 0.
 * Values above `max` are clamped at 150.
 *
 * @param rawValue - The actual reading for the macro
 * @param range - The standard value range (low, ideal, max) for this macro
 * @returns A normalized percentage value
 */
export function normalizeMacroValue(
  rawValue: number,
  range: MacroRange
): number {
  const { low, ideal, max } = range;
  const midpoint = (low + ideal) / 2;

  // Below the low boundary — linearly scale from 0 at 0 to 50 at low
  if (rawValue <= low) {
    if (low === 0) return 0;
    return Math.max(0, (rawValue / low) * 50);
  }

  // Between low and midpoint(low, ideal) — linearly scale from 50 to 100
  if (rawValue <= midpoint) {
    return 50 + ((rawValue - low) / (midpoint - low)) * 50;
  }

  // Between midpoint and max — linearly scale from 100 to 150
  if (rawValue <= max) {
    if (max === midpoint) return 150;
    return 100 + ((rawValue - midpoint) / (max - midpoint)) * 50;
  }

  // Above max — clamp at 150
  return 150;
}
