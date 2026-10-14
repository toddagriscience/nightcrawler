// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { localizePathname } from './locale-path';

describe('localizePathname', () => {
  describe('from an unprefixed (default locale) path', () => {
    it('adds the prefix without consuming the first segment', () => {
      expect(localizePathname('/research/index', 'es')).toBe(
        '/es/research/index'
      );
    });

    it('adds the prefix to a single-segment path', () => {
      expect(localizePathname('/about', 'es')).toBe('/es/about');
    });

    it('leaves the path untouched for the default locale', () => {
      expect(localizePathname('/research/index', 'en')).toBe('/research/index');
    });
  });

  describe('from a prefixed (non-default locale) path', () => {
    it('strips the prefix for the default locale', () => {
      expect(localizePathname('/es/research/index', 'en')).toBe(
        '/research/index'
      );
    });

    it('keeps the path stable when the locale does not change', () => {
      expect(localizePathname('/es/research/index', 'es')).toBe(
        '/es/research/index'
      );
    });
  });

  describe('the homepage', () => {
    it('maps / to the prefix alone', () => {
      expect(localizePathname('/', 'es')).toBe('/es');
    });

    it('maps the prefix alone back to /', () => {
      expect(localizePathname('/es', 'en')).toBe('/');
    });

    it('keeps / stable for the default locale', () => {
      expect(localizePathname('/', 'en')).toBe('/');
    });
  });

  describe('paths that resemble a locale prefix', () => {
    it('does not treat an unsupported two-letter segment as a prefix', () => {
      expect(localizePathname('/fr/about', 'es')).toBe('/es/fr/about');
    });

    it('only strips one leading locale segment', () => {
      expect(localizePathname('/es/es/about', 'en')).toBe('/es/about');
    });
  });

  it('round-trips through both locales', () => {
    const original = '/investors/governance';
    const spanish = localizePathname(original, 'es');

    expect(spanish).toBe('/es/investors/governance');
    expect(localizePathname(spanish, 'en')).toBe(original);
  });
});
