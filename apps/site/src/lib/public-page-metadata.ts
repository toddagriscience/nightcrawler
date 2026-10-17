// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getTranslations } from 'next-intl/server';
import {
  createLocalizedMetadata,
  defaultMetadata,
  siteConfig,
} from '@/lib/metadata';
import type { Metadata } from 'next';

const publicPagePaths = {
  home: '/',
  research: '/research',
  researchIndex: '/research/index',
  news: '/news',
  careers: '/careers',
  careerSearch: '/careers/search',
  about: '/about',
  contact: '/contact',
  investors: '/investors',
  esg: '/investors/esg',
  brand: '/brand',
  legal: '/legal',
  privacy: '/privacy',
  terms: '/terms',
  accessibility: '/accessibility',
  login: '/login',
  forgotPassword: '/forgot-password',
} as const;

/** Public routes with checked-in, language-specific search and social copy. */
export type PublicPageMetadataKey = keyof typeof publicPagePaths;

/** Complete metadata for a public page, without inherited generic social descriptions. */
export async function createPublicPageMetadata(
  page: PublicPageMetadataKey,
  locale: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata.pages' });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const careerImage = page === 'careers' || page === 'careerSearch';
  const image = careerImage
    ? `${siteConfig.url}/career-opengraph-image.png`
    : siteConfig.ogImage;
  return createLocalizedMetadata(
    {
      metadataBase: new URL(siteConfig.url),
      title: { absolute: title },
      description,
      robots: defaultMetadata.robots,
      openGraph: {
        title,
        description,
        type: 'website',
        siteName: siteConfig.name,
        locale: locale === 'es' ? 'es_US' : 'en_US',
        images: [
          {
            url: image,
            width: careerImage ? 2796 : 2396,
            height: careerImage ? 1460 : 1258,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: siteConfig.social.twitter,
        title,
        description,
        images: [image],
      },
    },
    publicPagePaths[page],
    locale
  );
}
