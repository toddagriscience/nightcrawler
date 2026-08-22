// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';

import { CAREERS_DISCLAIMER_LINKS } from '@/app/(unauthenticated)/[locale]/(marketing)/careers/constants/careers-disclaimers';
import en from './en.json';
import es from './es.json';

/**
 * The global next-intl mock (`vitest.setup.intl.js`) loads English only and pins
 * `useLocale` to `'en'`, so every component test asserts the English disclosures and the
 * Spanish half of this compliance change is invisible to them. These assertions read the
 * message files directly, so they cover both locales.
 */
const LOCALES = { en, es } as const;

/** Rich-text tags the `Disclaimer` consumer supplies; any other tag renders as nothing. */
const SUPPLIED_TAGS = Object.keys(CAREERS_DISCLAIMER_LINKS);

describe('careers.disclaimers messages', () => {
  it.each(Object.keys(LOCALES))(
    'exposes the same five numbered paragraphs in %s',
    (locale) => {
      const disclaimers =
        LOCALES[locale as keyof typeof LOCALES].careers.disclaimers;

      expect(Object.keys(disclaimers)).toEqual(['0', '1', '2', '3', '4']);
    }
  );

  it('wraps the same tags on the same paragraph in every locale', () => {
    const tagsByLocale = Object.fromEntries(
      Object.entries(LOCALES).map(([locale, messages]) => [
        locale,
        Object.entries(messages.careers.disclaimers).map(([key, message]) => [
          key,
          [...(message as string).matchAll(/<([a-z]+)>/gi)]
            .map(([, tag]) => tag)
            .sort(),
        ]),
      ])
    );

    // A tag present in one locale and missing in the other silently drops legally
    // required copy on that locale's page.
    expect(tagsByLocale.es).toEqual(tagsByLocale.en);
  });

  it.each(Object.keys(LOCALES))(
    'closes every tag it opens and supplies an href for it in %s',
    (locale) => {
      const disclaimers =
        LOCALES[locale as keyof typeof LOCALES].careers.disclaimers;

      for (const message of Object.values(disclaimers) as string[]) {
        for (const [, tag] of message.matchAll(/<([a-z]+)>/gi)) {
          expect(SUPPLIED_TAGS).toContain(tag);
          expect(message).toContain(`</${tag}>`);
        }
      }
    }
  );

  it.each(Object.keys(LOCALES))(
    'exposes no mailbox address and no bare URL in %s',
    (locale) => {
      const text = Object.values(
        LOCALES[locale as keyof typeof LOCALES].careers.disclaimers
      ).join(' ');

      // Issue #590: the accommodation notice must route through /contact, and the
      // Transparency in Coverage reference must be a link, not scrapeable text.
      expect(text).not.toMatch(/[\w.+-]+@[\w.-]+\.\w+/);
      expect(text).not.toMatch(/https?:\/\//);
    }
  );
});
