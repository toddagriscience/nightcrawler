// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { db } from '@/lib/db/schema/connection';
import {
  farm,
  farmCertificate,
  farmInfoInternalApplication,
  farmLocation,
  user,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ApplicationTabs from './components/application-tabs';

/** The apply page
 *
 * @returns {JSX.Element} - The application page*/
export default async function Apply() {
  const currentUser = await getAuthenticatedInfo();

  if ('error' in currentUser) {
    return <div></div>;
  }

  const farmId = currentUser.farmId!;
  const [farmInfo] = await db
    .select()
    .from(farm)
    .where(eq(farm.id, farmId))
    .fullJoin(farmLocation, eq(farmLocation.farmId, farmId))
    .fullJoin(farmCertificate, eq(farmCertificate.farmId, farmId))
    .limit(1);

  const allUsers = await db.select().from(user).where(eq(user.farmId, farmId));
  const [internalApplication] = await db
    .select()
    .from(farmInfoInternalApplication)
    .where(eq(farmInfoInternalApplication.farmId, farmId))
    .limit(1);

  return (
    <div className="mx-auto mb-8 w-[90vw] max-w-[800px]">
      <ApplicationTabs
        farmInfo={{
          ...farmInfo.farm,
          ...farmInfo.farm_location,
          ...farmInfo.farm_certificate,
        }}
        allUsers={allUsers}
        internalApplication={internalApplication}
      />
    </div>
  );
}
