// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useSearchParams } from 'next/navigation';
import OnboardingForm from './components/onboarding-form';

/** This is more commonly referred to as "outbound onboarding". I.e, we've contacted a client and they've agreed to join our platform, and this is the form that we send them.
 *
 * @returns {JSX.Element} The onboarding form */
export default function Onboarding() {
  const searchParams = useSearchParams();

  return (
    <OnboardingForm
      firstName={searchParams.get('first_name') || ''}
      lastName={searchParams.get('last_name') || ''}
      farmName={searchParams.get('farm_name') || ''}
      email={searchParams.get('email') || ''}
      phone={searchParams.get('phone') || ''}
    />
  );
}
