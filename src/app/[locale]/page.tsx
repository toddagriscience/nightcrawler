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
