// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createPublicPageMetadata } from '@/lib/public-page-metadata';

import type { Metadata } from 'next';
import Homepage from './components/homepage/homepage';
import { NewsHighlightTilesSection } from './components/news-highlight-tiles/news-highlight-tiles';

/** Complete translated metadata for the marketing homepage. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPublicPageMetadata('home', locale);
}

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
