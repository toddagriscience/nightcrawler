import LandingPage from '@/components/landing/page/landing-page';

export default async function HomePage(
  {
    // params
  }: {
    params: Promise<{ locale: string }>;
  }
) {
  // const { locale } = await params;

  // TODO: Add authentication check here
  // const isAuthenticated = await checkAuthentication();
  // if (isAuthenticated) {
  //   return <DashboardPage locale={locale} />;
  // }

  // For now, always render the landing page
  // The locale will be used later for authentication and dashboard routing
  return <LandingPage />;
}
