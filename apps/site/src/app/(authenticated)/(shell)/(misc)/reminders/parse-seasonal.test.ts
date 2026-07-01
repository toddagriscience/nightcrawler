// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { parseSeasonalLabel } from './parse-seasonal';

// Fixed reference so relative/next-occurrence math is deterministic: Jan 15 2026.
const REF = new Date(2026, 0, 15);

function ymd(date: Date | null) {
  if (!date) return null;
  return [date.getFullYear(), date.getMonth(), date.getDate()];
}

describe('parseSeasonalLabel', () => {
  it('returns null for empty or non-string input', () => {
    expect(parseSeasonalLabel('', REF)).toBeNull();
    // @ts-expect-error testing runtime guard against non-string
    expect(parseSeasonalLabel(null, REF)).toBeNull();
  });

  it('returns null for unparseable text', () => {
    expect(parseSeasonalLabel('sometime soon-ish', REF)).toBeNull();
  });

  it('parses "mid [month]" to the 15th', () => {
    expect(ymd(parseSeasonalLabel('mid March', REF))).toEqual([2026, 2, 15]);
  });

  it('parses "early [month]" to the 1st', () => {
    expect(ymd(parseSeasonalLabel('early April', REF))).toEqual([2026, 3, 1]);
  });

  it('parses "early [season]" using the season month', () => {
    // early spring → March (month 2), the 1st.
    expect(ymd(parseSeasonalLabel('early spring', REF))).toEqual([2026, 2, 1]);
  });

  it('parses "early summer" to June', () => {
    expect(ymd(parseSeasonalLabel('early summer', REF))).toEqual([2026, 5, 1]);
  });

  it('parses "early fall" to September', () => {
    expect(ymd(parseSeasonalLabel('early fall', REF))).toEqual([2026, 8, 1]);
  });

  it('parses "early winter" to December of the reference year (no overflow)', () => {
    // Regression guard: winter must map to December (month 11) of REF's year,
    // NOT overflow into January of the next year.
    expect(ymd(parseSeasonalLabel('early winter', REF))).toEqual([2026, 11, 1]);
  });

  it('parses "late [month]" to the 15th', () => {
    expect(ymd(parseSeasonalLabel('late June', REF))).toEqual([2026, 5, 15]);
  });

  it('parses "[N] months from now" relative to the reference date', () => {
    expect(ymd(parseSeasonalLabel('3 months from now', REF))).toEqual([
      2026, 3, 15,
    ]);
  });

  it('parses "when soil warms up" to April 15', () => {
    expect(ymd(parseSeasonalLabel('when soil warms up', REF))).toEqual([
      2026, 3, 15,
    ]);
  });

  it('parses "end of season" to December 31', () => {
    expect(ymd(parseSeasonalLabel('end of season', REF))).toEqual([
      2026, 11, 31,
    ]);
  });

  it('rolls "end of season" to next year when Dec 31 has already passed', () => {
    // Reference date is late December (Dec 20 2026); Dec 31 2026 is still
    // ahead, so it must stay in 2026.
    const lateDec = new Date(2026, 11, 20);
    expect(ymd(parseSeasonalLabel('end of season', lateDec))).toEqual([
      2026, 11, 31,
    ]);

    // Reference date is exactly Dec 31 2026: it is not in the past, so it
    // resolves to that same day rather than rolling forward.
    const onDec31 = new Date(2026, 11, 31);
    expect(ymd(parseSeasonalLabel('end of season', onDec31))).toEqual([
      2026, 11, 31,
    ]);
  });

  it('parses "end of [month]" to the last day of that month', () => {
    expect(ymd(parseSeasonalLabel('end of March', REF))).toEqual([2026, 2, 31]);
  });

  it('parses "first week of [month]" to the 7th', () => {
    expect(ymd(parseSeasonalLabel('first week of May', REF))).toEqual([
      2026, 4, 7,
    ]);
  });

  it('parses "second week of [month]" to the 14th', () => {
    expect(ymd(parseSeasonalLabel('second week of May', REF))).toEqual([
      2026, 4, 14,
    ]);
  });

  it('rolls to next year when the month/day has already passed', () => {
    // Ref is Jan 15; "early January" (Jan 1) is in the past, so → Jan 2027.
    expect(ymd(parseSeasonalLabel('early January', REF))).toEqual([2027, 0, 1]);
  });
});
