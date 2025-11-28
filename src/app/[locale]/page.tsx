// Copyright Todd Agriscience, Inc. All rights reserved.

import LandingPage from '@/components/landing/page/landing-page';
import type { Metadata } from 'next';

/**
 * Metadata for the localized home page
 */
export const metadata: Metadata = {
  title: 'Todd | Global Leader in Sustainable Agriculture',
  description:
    'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers',
  openGraph: {
    title: 'Todd | Global Leader in Sustainable Agriculture',
    description:
      'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers',
  },
  twitter: {
    card: 'summary',
    title: 'Todd | Global Leader in Sustainable Agriculture',
    description:
      'Todd combines deep experience in regenerative agriculture, farm management and engaging consumers',
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
