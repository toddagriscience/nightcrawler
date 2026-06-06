// Copyright © Todd Agriscience, Inc. All rights reserved.

import { normalizePhoneForUrl } from '@nightcrawler/db/utils/normalize-phone';
import OnboardingForm from './components/onboarding-form';

/** Search params accepted by the incoming onboarding page. */
type IncomingPageSearchParams = Record<string, string | string[] | undefined>;

/**
 * Reads a single string value from Next.js search params.
 *
 * @param params - Page search params
 * @param key - Query key to read
 */
function readSearchParam(
  params: IncomingPageSearchParams,
  key: string
): string {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

/**
 * Outbound onboarding confirm step (`/incoming` → localized signup).
 *
 * @param props - Page search params with applicant prefill
 */
export default async function Onboarding({
  searchParams,
}: {
  searchParams: Promise<IncomingPageSearchParams>;
}) {
  const params = await searchParams;

  return (
    <OnboardingForm
      firstName={readSearchParam(params, 'first_name')}
      lastName={readSearchParam(params, 'last_name')}
      farmName={readSearchParam(params, 'farm_name')}
      email={readSearchParam(params, 'email')}
      phone={normalizePhoneForUrl(readSearchParam(params, 'phone'))}
      applicationId={readSearchParam(params, 'application_id')}
      token={readSearchParam(params, 'token')}
    />
  );
}
