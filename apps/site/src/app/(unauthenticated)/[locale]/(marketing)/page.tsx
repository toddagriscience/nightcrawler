// Copyright © Todd Agriscience, Inc. All rights reserved.

import { siteConfig } from '@/lib/metadata';
import type { Metadata } from 'next';
import Homepage from './components/homepage/homepage';

/**
 * Homepage metadata for SEO and social media
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://toddagriscience.com'),
  title: {
    absolute: 'Todd | Global Leader in Sustainable Agriculture',
  },
  description:
    'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers.',
  alternates: {
    canonical: 'https://toddagriscience.com/en/',
  },
  openGraph: {
    title: 'Todd | Global Leader in Sustainable Agriculture',
    description:
      'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers.',
    url: 'https://toddagriscience.com/en/',
    siteName: siteConfig.name,
    locale: 'en',
    type: 'website',
    images: [
      {
        url: 'https://www.toddagriscience.com/opengraph-image.png',
        width: 1300,
        height: 740,
        type: 'image/png',
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ToddAgriscience',
    title: 'Todd | Global Leader in Sustainable Agriculture',
    description:
      'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers.',
    images: ['https://www.toddagriscience.com/opengraph-image.png'],
  },
};

export default async function HomePage({}: {
  params: Promise<{ locale: string }>;
}) {
  return <Homepage />;
}
