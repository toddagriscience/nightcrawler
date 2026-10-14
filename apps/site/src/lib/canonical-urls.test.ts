// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import {
  getCanonicalUrl,
  getLocalizedPath,
  getPageAlternates,
} from './canonical-urls';

vi.mock('@/lib/env', () => ({
  env: { baseUrl: 'https://toddagriscience.com/' },
}));

describe('final marketing URLs', () => {
  it.each(['/about', '/en/about', '/en/about/?campaign=x#section'])(
    'normalizes English path %s without redirects or tracking parameters',
    (path) => {
      expect(getCanonicalUrl(path)).toBe('https://toddagriscience.com/about');
    }
  );
  it('preserves navigation filters and fragments while normalizing the locale prefix', () => {
    expect(getLocalizedPath('/en/research/index?topic=soil#results')).toBe(
      '/research/index?topic=soil#results'
    );
    expect(
      getLocalizedPath('/en/research/index?topic=soil#results', 'es')
    ).toBe('/es/research/index?topic=soil#results');
  });
  it('uses /es for the Spanish homepage and never a trailing-slash redirect', () => {
    expect(getLocalizedPath('/', 'es')).toBe('/es');
    expect(getCanonicalUrl('/es/', 'es')).toBe(
      'https://toddagriscience.com/es'
    );
  });
  it('uses the final English canonical as x-default on both translations', () => {
    expect(getPageAlternates('/research', 'es')).toEqual({
      canonical: 'https://toddagriscience.com/es/research',
      languages: {
        en: 'https://toddagriscience.com/research',
        es: 'https://toddagriscience.com/es/research',
        'x-default': 'https://toddagriscience.com/research',
      },
    });
  });
});
