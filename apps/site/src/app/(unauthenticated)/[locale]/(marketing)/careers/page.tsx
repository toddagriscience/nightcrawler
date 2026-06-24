// Copyright © Todd Agriscience, Inc. All rights reserved.

import { CareersLanding } from './components/careers-landing';

/**
 * Careers hub at `/careers`: company story and values; open roles live at `/careers/search`.
 *
 * @param params - Route params including locale
 */
export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CareersLanding locale={locale} />;
}
