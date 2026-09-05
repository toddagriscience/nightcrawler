// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { formatPhValue, toPhRange } from './to-ph-range';

const HARDEN_TARGET = { phLow: 7.3, phHigh: 7.8 };

describe('formatPhValue', () => {
  it('formats the reading as pH, never ppm', () => {
    expect(formatPhValue(7.4)).toBe('pH 7.4');
    expect(formatPhValue(9)).toBe('pH 9.0');
    expect(formatPhValue(7.4)).not.toContain('ppm');
  });
});

describe('toPhRange', () => {
  it('places the Harden 7 marker inside the fixed 5.5–8.0 domain, not at the right edge', () => {
    const result = toPhRange({ value: 7.4, ...HARDEN_TARGET });

    expect(result.markerPercent).toBeCloseTo(76);
    expect(result.markerPercent).not.toBe(100);
    expect(result.ticks).toEqual([5.5, 6.0, 6.5, 7.0, 7.5, 8.0]);
  });

  it('reports within target for the Harden 7 demo reading', () => {
    const result = toPhRange({ value: 7.4, ...HARDEN_TARGET });

    expect(result.status).toBe('within');
    expect(result.statusLabel).toBe('Within target range');
    expect(result.statusLine).toBe('Within target range · pH 7.4');
    expect(result.statusLine).not.toContain('Low');
    expect(result.displayValue).toBe('pH 7.4');
  });

  it('reports below and above the configured target band', () => {
    const below = toPhRange({ value: 6.8, ...HARDEN_TARGET });
    expect(below.status).toBe('below');
    expect(below.statusLine).toBe('Below target range · pH 6.8');

    const above = toPhRange({ value: 7.9, ...HARDEN_TARGET });
    expect(above.status).toBe('above');
    expect(above.statusLine).toBe('Above target range · pH 7.9');
  });

  it('uses the inclusive target bounds', () => {
    expect(toPhRange({ value: 7.3, ...HARDEN_TARGET }).status).toBe('within');
    expect(toPhRange({ value: 7.8, ...HARDEN_TARGET }).status).toBe('within');
  });

  it('accepts Drizzle numeric strings as a configured target', () => {
    const result = toPhRange({
      value: 7.4,
      phLow: '7.3',
      phHigh: '7.8',
    });

    expect(result.status).toBe('within');
    expect(result.statusLine).toBe('Within target range · pH 7.4');
    expect(result.segments).toMatchObject({
      acidicPercent: expect.any(Number),
      targetPercent: expect.any(Number),
      alkalinePercent: expect.any(Number),
    });
    expect(result.target).toMatchObject({ low: 7.3, high: 7.8 });
  });

  it('falls back to neutral copy when the farm has no pH target', () => {
    const result = toPhRange({ value: 7.4, phLow: null, phHigh: null });

    expect(result.status).toBe('unconfigured');
    expect(result.statusLabel).toBe('Target range not configured');
    expect(result.statusLine).toBe('Target range not configured · pH 7.4');
    expect(result.target).toBeNull();
    expect(result.segments).toBeNull();
    expect(result.displayValue).toBe('pH 7.4');
    expect(result.markerPercent).toBeCloseTo(76);
  });

  it('treats a missing bound as unconfigured', () => {
    expect(toPhRange({ value: 7.4, phLow: 7.3, phHigh: null }).status).toBe(
      'unconfigured'
    );
    expect(toPhRange({ value: 7.4, phLow: null, phHigh: 7.8 }).status).toBe(
      'unconfigured'
    );
    expect(toPhRange({ value: 7.4, phLow: '', phHigh: '7.8' }).status).toBe(
      'unconfigured'
    );
  });

  it('clamps the marker to the display domain without changing the shown value', () => {
    const below = toPhRange({ value: 4.1, ...HARDEN_TARGET });
    expect(below.markerPercent).toBe(0);
    expect(below.displayValue).toBe('pH 4.1');
    expect(below.status).toBe('below');

    const atMax = toPhRange({ value: 8.0, ...HARDEN_TARGET });
    expect(atMax.markerPercent).toBe(100);
    expect(atMax.displayValue).toBe('pH 8.0');

    const above = toPhRange({ value: 9.0, ...HARDEN_TARGET });
    expect(above.markerPercent).toBe(100);
    expect(above.displayValue).toBe('pH 9.0');
    expect(above.status).toBe('above');
  });

  it('clamps the painted target band to the display domain', () => {
    const alkalineCrop = toPhRange({
      value: 7.4,
      phLow: 8.2,
      phHigh: 8.8,
    });
    expect(alkalineCrop.target).toMatchObject({
      low: 8.2,
      high: 8.8,
      startPercent: 100,
      widthPercent: 0,
    });
    expect(alkalineCrop.status).toBe('below');
  });
});
