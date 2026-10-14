// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import english from '@/messages/common/en.json';
import spanish from '@/messages/common/es.json';
import {
  createPublicPageMetadata,
  type PublicPageMetadataKey,
} from './public-page-metadata';

vi.mock('@/lib/env', () => ({
  env: { baseUrl: 'https://toddagriscience.com' },
}));
vi.mock('next-intl/server', async () => {
  const { createTranslator } =
    await vi.importActual<typeof import('next-intl')>('next-intl');
  return {
    getTranslations: vi.fn(
      async ({
        locale,
        namespace,
      }: {
        locale: string;
        namespace: 'metadata.pages';
      }) =>
        createTranslator({
          locale,
          namespace,
          messages: locale === 'es' ? spanish : english,
        })
    ),
  };
});

const corePages: Array<{ key: PublicPageMetadataKey; path: string }> = [
  { key: 'home', path: '/' },
  { key: 'research', path: '/research' },
  { key: 'news', path: '/news' },
  { key: 'careers', path: '/careers' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' },
  { key: 'investors', path: '/investors' },
  { key: 'esg', path: '/investors/esg' },
];

describe('complete route-specific search and social metadata', () => {
  it.each(['en', 'es'])(
    'uses distinct %s copy for the core pages',
    async (locale) => {
      const pages = await Promise.all(
        corePages.map(({ key }) => createPublicPageMetadata(key, locale))
      );
      expect(new Set(pages.map((metadata) => metadata.description)).size).toBe(
        corePages.length
      );
      expect(
        pages.some(
          (metadata) => metadata.description === english.metadata.description
        )
      ).toBe(false);
      for (const [index, metadata] of pages.entries()) {
        const { key, path } = corePages[index];
        const copy = (locale === 'es' ? spanish : english).metadata.pages[key];
        const url = `https://toddagriscience.com${locale === 'es' ? '/es' : ''}${locale === 'es' && path === '/' ? '' : path}`;
        expect(metadata).toMatchObject({
          title: { absolute: copy.title },
          description: copy.description,
          alternates: { canonical: url },
          robots: { index: true, follow: true },
          openGraph: {
            title: copy.title,
            description: copy.description,
            url,
            locale: locale === 'es' ? 'es_US' : 'en_US',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: copy.title,
            description: copy.description,
          },
        });
        expect(
          metadata.openGraph &&
            'images' in metadata.openGraph &&
            metadata.openGraph.images
        ).toBeDefined();
        expect(
          metadata.twitter &&
            'images' in metadata.twitter &&
            metadata.twitter.images
        ).toBeDefined();
      }
    }
  );
});
