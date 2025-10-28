// Copyright Todd LLC, All rights reserved.

import LandingPage from '@/components/landing/page/landing-page';

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
