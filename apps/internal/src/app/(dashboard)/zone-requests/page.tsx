// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getZoneRequests } from './actions';
import ZoneRequestsClient from './components/zone-requests-client';

/** Keeps the staff request queue current on every visit. */
export const dynamic = 'force-dynamic';

/** Sample-kit operations queue, separate from analysis entry. */
export default async function ZoneRequestsPage() {
  return <ZoneRequestsClient requests={await getZoneRequests()} />;
}
