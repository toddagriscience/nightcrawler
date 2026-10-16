// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import { generateMetadata } from './layout';

vi.mock('@/i18n/config', () => ({
  routing: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localePrefix: 'as-needed',
  },
}));

vi.mock('@/lib/env', () => ({
  env: { baseUrl: 'https://toddagriscience.com/' },
}));

describe('Varieties metadata', () => {
  it.each([
    ['en', 'https://toddagriscience.com/varieties'],
    ['es', 'https://toddagriscience.com/es/varieties'],
  ])(
    'uses the public %s URL for canonical and sharing',
    async (locale, url) => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale }),
      });

      expect(metadata.alternates).toEqual({
        canonical: url,
        languages: {
          en: 'https://toddagriscience.com/varieties',
          es: 'https://toddagriscience.com/es/varieties',
          'x-default': 'https://toddagriscience.com/varieties',
        },
      });
      expect(metadata.openGraph?.url).toBe(url);
      expect(metadata.openGraph?.images).toEqual([
        {
          url: 'https://toddagriscience.com/opengraph-image.png',
          alt: 'Todd',
        },
      ]);
      expect(metadata.twitter?.images).toEqual([
        'https://toddagriscience.com/opengraph-image.png',
      ]);
    }
  );
});
