// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  buildMinerals,
  checkFourLows,
  computeTag,
  IDEAL_VALUES,
  MEQ_TO_PPM,
  type LabRow,
  type MineralInsert,
} from './soil-conversion';

/** Builds a LabRow with every field null, overriding only what a test needs. */
function labRow(overrides: Partial<LabRow> = {}): LabRow {
  return {
    no: 1,
    description: 'test',
    crop: null,
    sp: null,
    ph: null,
    ec: null,
    ca: null,
    mg: null,
    na: null,
    cl: null,
    esp: null,
    gypsumReq: null,
    lime: null,
    b: null,
    no3n: null,
    po4p: null,
    k: null,
    zn: null,
    mn: null,
    fe: null,
    cu: null,
    om: null,
    ...overrides,
  };
}

/** Finds a mineral by name in a buildMinerals result. */
function mineral(
  minerals: MineralInsert[],
  name: MineralInsert['name']
): MineralInsert | undefined {
  return minerals.find((m) => m.name === name);
}

describe('buildMinerals — meq/l → PPM conversion', () => {
  it('converts Ca/Mg/Na from meq/l when the sheet is not already PPM', () => {
    const minerals = buildMinerals(
      labRow({ ca: 5, mg: 3, na: 2 }),
      'AAAAAA-BBBBBB',
      false
    );

    expect(mineral(minerals, 'Calcium')?.realValue).toBeCloseTo(
      5 * MEQ_TO_PPM.Ca
    );
    expect(mineral(minerals, 'Magnesium')?.realValue).toBeCloseTo(
      3 * MEQ_TO_PPM.Mg
    );
    expect(mineral(minerals, 'Sodium')?.realValue).toBeCloseTo(
      2 * MEQ_TO_PPM.Na
    );
  });

  it('stores Ca/Mg/Na as-is when the sheet is already in PPM', () => {
    const minerals = buildMinerals(
      labRow({ ca: 16000, mg: 11000, na: 500 }),
      'AAAAAA-BBBBBB',
      true
    );

    expect(mineral(minerals, 'Calcium')?.realValue).toBe(16000);
    expect(mineral(minerals, 'Magnesium')?.realValue).toBe(11000);
    expect(mineral(minerals, 'Sodium')?.realValue).toBe(500);
  });

  it('stores mg/kg minerals unchanged and skips null values', () => {
    const minerals = buildMinerals(labRow({ k: 300, zn: 2 }), 'ID', true);

    expect(mineral(minerals, 'Potassium')?.realValue).toBe(300);
    expect(mineral(minerals, 'Zinc')?.realValue).toBe(2);
    expect(mineral(minerals, 'Calcium')).toBeUndefined();
  });

  it('attaches ideal values from the framework and tags pH as dimensionless', () => {
    const minerals = buildMinerals(labRow({ ph: 6.8, k: 1200 }), 'ID', true);

    expect(mineral(minerals, 'PH')?.units).toBe('dimensionless');
    expect(mineral(minerals, 'Potassium')?.idealValue).toBe(
      IDEAL_VALUES.Potassium
    );
  });
});

describe('computeTag', () => {
  it('tags calcium by its meq/l value', () => {
    expect(computeTag('Calcium', labRow({ ca: 4 }), false)).toBe('Low');
    expect(computeTag('Calcium', labRow({ ca: 8 }), false)).toBe('Med');
    expect(computeTag('Calcium', labRow({ ca: 12 }), false)).toBe('High');
  });

  it('converts PPM calcium back to meq/l before tagging', () => {
    // 8 meq/l stored as PPM should still tag Med, not High.
    const ppm = 8 * MEQ_TO_PPM.Ca;
    expect(computeTag('Calcium', labRow({ ca: ppm }), true)).toBe('Med');
  });

  it('returns null for minerals without a lab reference range', () => {
    expect(computeTag('Sodium', labRow({ na: 500 }), true)).toBeNull();
    expect(computeTag('Boron', labRow({ b: 0.5 }), true)).toBeNull();
  });

  it('returns null when the source value is missing', () => {
    expect(computeTag('Potassium', labRow(), true)).toBeNull();
  });
});

describe('checkFourLows', () => {
  it('is true only when all four base minerals sit below their thresholds', () => {
    const low = buildMinerals(
      labRow({ ca: 1000, mg: 3000, na: 5, k: 100 }),
      'ID',
      true
    );
    expect(checkFourLows(low)).toBe(true);
    // buildMinerals should have flagged the four base minerals.
    expect(mineral(low, 'Calcium')?.fourLows).toBe(true);
    expect(mineral(low, 'Potassium')?.fourLows).toBe(true);
  });

  it('is false when any base mineral is at or above its threshold', () => {
    const minerals = buildMinerals(
      labRow({ ca: 3000, mg: 3000, na: 5, k: 100 }),
      'ID',
      true
    );
    expect(checkFourLows(minerals)).toBe(false);
    expect(mineral(minerals, 'Calcium')?.fourLows).toBe(false);
  });

  it('is false when a base mineral is missing entirely', () => {
    const minerals = buildMinerals(
      labRow({ ca: 1000, mg: 3000, na: 5 }),
      'ID',
      true
    );
    expect(checkFourLows(minerals)).toBe(false);
  });
});
