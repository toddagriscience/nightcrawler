// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { formatArticleHeroDate } from './utils';

// Midday UTC so the assertions hold whatever timezone offset the runner sits on.
const NOVEMBER_TWENTIETH = '2025-11-20T12:00:00.000Z';

describe('formatArticleHeroDate', () => {
  it('separates the year with a comma in English', () => {
    expect(formatArticleHeroDate(NOVEMBER_TWENTIETH, 'en')).toBe(
      '20 November, 2025'
    );
  });

  it('leaves Spanish phrasing intact, where that comma would land mid-phrase', () => {
    expect(formatArticleHeroDate(NOVEMBER_TWENTIETH, 'es')).toBe(
      '20 de noviembre de 2025'
    );
  });

  it('formats in English when no locale is supplied', () => {
    expect(formatArticleHeroDate(NOVEMBER_TWENTIETH)).toBe('20 November, 2025');
  });

  it('returns an empty string when the article carries no date', () => {
    expect(formatArticleHeroDate(null)).toBe('');
    expect(formatArticleHeroDate(undefined)).toBe('');
  });
});
