// Copyright © Todd Agriscience, Inc. All rights reserved.

export const dynamic = 'force-dynamic';

import { getPlatformAccessApplications } from './actions';
import ApplicationsClient from './components/applications-client';

/**
 * Platform access applications review page.
 */
export default async function ApplicationsPage() {
  const initialApplications = await getPlatformAccessApplications();

  return <ApplicationsClient initialApplications={initialApplications} />;
}
