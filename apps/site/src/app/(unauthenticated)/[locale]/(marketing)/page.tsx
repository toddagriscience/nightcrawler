// Copyright © Todd Agriscience, Inc. All rights reserved.

import { siteConfig } from '@/lib/metadata';
import type { Metadata } from 'next';
import Homepage from './components/homepage/homepage';
import { NewsHighlightTilesSection } from './components/news-highlight-tiles/news-highlight-tiles';

/**
 * Homepage metadata for SEO and social media
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    absolute: siteConfig.homeTitle,
  },
  description: siteConfig.description,
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
  openGraph: {
    title: siteConfig.homeTitle,
    description: siteConfig.description,
    url: `${siteConfig.url}/`,
    siteName: siteConfig.name,
    locale: 'en',
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1300,
        height: 740,
        type: 'image/png',
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    title: siteConfig.homeTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

/**
 * Marketing homepage. The highlight strip is server-rendered here and handed to
 * the client body as a prop.
 *
 * @param params - Route params including locale
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Homepage
      highlights={
        <NewsHighlightTilesSection
          locale={locale}
          page="homepage"
          sectionId="homepage-highlights"
        />
      }
    />
  );
}
