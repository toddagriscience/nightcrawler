// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  toMineralChartProps,
  type MineralThresholds,
} from './to-mineral-chart';

const calciumThresholds: MineralThresholds = {
  min: 0,
  low: 100.2,
  ideal: 150.3,
  high: 200.4,
  max: 200.4,
};

const sampleDate = new Date('2025-09-15');

describe('toMineralChartProps', () => {
  it('maps an in-range reading without clamping', () => {
    const result = toMineralChartProps({
      name: 'Calcium',
      realValue: 148,
      date: sampleDate,
      storedUnit: 'ppm',
      thresholds: calciumThresholds,
    });

    expect(result).toMatchObject({
      min: 0,
      max: 200.4,
      standards: { low: 100.2, ideal: 150.3, high: 200.4 },
    });
    expect(result?.chartData[0]).toMatchObject({
      x: 148,
      realValue: 148,
      unit: 'ppm',
      date: sampleDate,
    });
  });

  it('clamps a reading above max and keeps the real value', () => {
    const result = toMineralChartProps({
      name: 'Calcium',
      realValue: 1850,
      date: sampleDate,
      storedUnit: 'ppm',
      thresholds: calciumThresholds,
    });

    expect(result?.chartData[0]).toMatchObject({
      x: 200.4,
      realValue: 1850,
      unit: 'ppm',
    });
  });

  it('clamps a reading below min and keeps the real value', () => {
    const result = toMineralChartProps({
      name: 'Calcium',
      realValue: -5,
      date: sampleDate,
      storedUnit: 'ppm',
      thresholds: calciumThresholds,
    });

    expect(result?.chartData[0]).toMatchObject({
      x: 0,
      realValue: -5,
    });
  });

  it('returns null when standards are missing', () => {
    expect(
      toMineralChartProps({
        name: 'Calcium',
        realValue: 148,
        date: sampleDate,
        storedUnit: 'ppm',
        thresholds: null,
      })
    ).toBeNull();
  });
});
