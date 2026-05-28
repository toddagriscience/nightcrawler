// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import { getLocalizedPath, getLocalizedUrl } from './locale-utils';

vi.mock('./env', () => ({
  env: {
    baseUrl: 'https://toddagriscience.com',
  },
}));

describe('getLocalizedPath', () => {
  it('omits the prefix for the default locale', () => {
    expect(getLocalizedPath('en', '/about')).toBe('/about');
    expect(getLocalizedPath('en', '/')).toBe('/');
  });

  it('adds a locale prefix for non-default locales', () => {
    expect(getLocalizedPath('es', '/about')).toBe('/es/about');
    expect(getLocalizedPath('es', '/')).toBe('/es');
  });
});

describe('getLocalizedUrl', () => {
  it('builds absolute URLs with locale rules applied', () => {
    expect(getLocalizedUrl('en', '/about')).toBe(
      'https://toddagriscience.com/about'
    );
    expect(getLocalizedUrl('es', '/about')).toBe(
      'https://toddagriscience.com/es/about'
    );
    expect(getLocalizedUrl('en', '/')).toBe('https://toddagriscience.com');
  });
});
