// Copyright © Todd Agriscience, Inc. All rights reserved.

import LandingPage from '@/components/landing/page/landing-page';
import type { Metadata } from 'next';

/**
 * Homepage metadata
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
    siteName: 'Todd United States',
    locale: 'en',
    type: 'website',
    images: [
      {
        url: 'https://www.toddagriscience.com/opengraph-image.png',
        width: 1300,
        height: 740,
        type: 'image/png',
        alt: 'Todd United States',
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
  return <LandingPage />;
}
