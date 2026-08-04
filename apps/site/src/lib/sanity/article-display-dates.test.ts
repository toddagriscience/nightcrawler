// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  ARTICLE_DISPLAY_DATE_LOCALE,
  formatArticleListDate,
  resolveArticleDisplayDateLocale,
} from './article-display-dates';

// Midday UTC so the assertions hold whatever timezone offset the runner sits on.
const JUNE_FIRST = '2026-06-01T12:00:00.000Z';

describe('resolveArticleDisplayDateLocale', () => {
  it('maps each supported site locale to its display locale', () => {
    expect(resolveArticleDisplayDateLocale('en')).toBe('en-GB');
    expect(resolveArticleDisplayDateLocale('es')).toBe('es-ES');
  });

  it('falls back to English for missing or unknown locales', () => {
    expect(resolveArticleDisplayDateLocale()).toBe(ARTICLE_DISPLAY_DATE_LOCALE);
    expect(resolveArticleDisplayDateLocale('fr')).toBe(
      ARTICLE_DISPLAY_DATE_LOCALE
    );
  });
});

describe('formatArticleListDate', () => {
  it('keeps the day-first English wording', () => {
    expect(formatArticleListDate(JUNE_FIRST, 'en')).toBe('1 June 2026');
  });

  it('localizes the month and its connectors in Spanish', () => {
    expect(formatArticleListDate(JUNE_FIRST, 'es')).toBe('1 de junio de 2026');
  });

  it('formats in English when no locale is supplied', () => {
    expect(formatArticleListDate(JUNE_FIRST)).toBe('1 June 2026');
  });

  it('returns an empty string when the article carries no date', () => {
    expect(formatArticleListDate(undefined, 'es')).toBe('');
    expect(formatArticleListDate('', 'es')).toBe('');
  });
});
