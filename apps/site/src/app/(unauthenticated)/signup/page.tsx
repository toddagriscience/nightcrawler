// Copyright © Todd Agriscience, Inc. All rights reserved.

import { redirect } from 'next/navigation';

/** Keeps approval emails pointing at /signup compatible with the unified onboarding page. */
export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const applicationId =
    typeof params.application_id === 'string' ? params.application_id : '';
  const token = typeof params.token === 'string' ? params.token : '';
  if (!applicationId || !token) redirect('/contact');
  const query = new URLSearchParams({ application_id: applicationId, token });
  redirect('/apply?' + query.toString());
}
