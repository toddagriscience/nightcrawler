// Copyright Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import LandingPage from '@/components/landing/page/landing-page';

/**
 * Homepage metadata - uses specific title without template
 */
export const metadata: Metadata = {
  title: {
    absolute: 'Todd | Global Leader in Sustainable Agriculture',
  },
  description:
    'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers.',
  alternates: {
    canonical: 'https://toddagriscience.com/us/en/',
  },
  openGraph: {
    title: 'Todd | Global Leader in Sustainable Agriculture',
    description:
      'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers.',
    url: 'https://toddagriscience.com/en/',
    siteName: 'Todd',
    locale: 'en',
    type: 'website',
    images: [
      {
        url: 'https://www.toddagriscience.com/opengraph-image.png',
        width: 1300,
        height: 740,
        type: 'image/png',
        alt: 'Todd Agriscience',
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

/**
 * Home page for the app
 * @param {Promise<{ locale: string }>} params - The parameters for the function
 * @returns {React.ReactNode} - The home page component
 */
export default async function HomePage({}: {
  params: Promise<{ locale: string }>;
}) {
  return <LandingPage />;
}
