// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  getIntlMarketingSegment,
  getPathnameLocale,
  isRouteInternationalized,
} from './routing';

describe('routing helpers', () => {
  it('detects explicit locale segments', () => {
    expect(getPathnameLocale('/es/about')).toBe('es');
    expect(getPathnameLocale('/en/about')).toBe('en');
    expect(getPathnameLocale('/about')).toBeNull();
  });

  it('treats unprefixed marketing paths as internationalized', () => {
    expect(isRouteInternationalized('/about')).toBe(true);
    expect(isRouteInternationalized('/')).toBe(true);
    expect(isRouteInternationalized('/incoming')).toBe(false);
  });

  it('reads marketing segments with and without locale prefixes', () => {
    expect(getIntlMarketingSegment('/privacy')).toBe('privacy');
    expect(getIntlMarketingSegment('/es/privacy')).toBe('privacy');
    expect(getIntlMarketingSegment('/en/privacy')).toBe('privacy');
  });
});
