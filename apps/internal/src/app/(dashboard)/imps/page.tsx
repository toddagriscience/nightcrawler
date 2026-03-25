/**
 * Force dynamic rendering to ensure dashboard data is fetched at request time.
 */
export const dynamic = 'force-dynamic';

// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getImps } from './actions';
import ImpsClient from './components/imps-client';

/**
 * Integrated Management Plans page.
 * Fetches initial data server-side and delegates interaction to the client component.
 */
export default async function ImpsPage() {
  const initialImps = await getImps();

  return <ImpsClient initialImps={initialImps} />;
}
