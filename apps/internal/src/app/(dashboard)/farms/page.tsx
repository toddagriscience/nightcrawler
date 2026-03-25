/**
 * Force dynamic rendering to ensure dashboard data is fetched at request time.
 */
export const dynamic = 'force-dynamic';

// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  getFarms,
  getManagementZones,
  getStandardValues,
  getFarmSubscriptions,
} from './actions';
import FarmsClient from './components/farms-client';

/**
 * Farms management page.
 * Fetches all initial data server-side and delegates interaction to the client component.
 */
export default async function FarmsPage() {
  const [
    initialFarms,
    initialZones,
    initialStandardValues,
    initialSubscriptions,
  ] = await Promise.all([
    getFarms(),
    getManagementZones(),
    getStandardValues(),
    getFarmSubscriptions(),
  ]);

  return (
    <FarmsClient
      initialFarms={initialFarms}
      initialZones={initialZones}
      initialStandardValues={initialStandardValues}
      initialSubscriptions={initialSubscriptions}
    />
  );
}
