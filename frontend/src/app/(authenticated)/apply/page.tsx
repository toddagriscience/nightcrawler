// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { db } from '@/lib/db/schema/connection';
import {
  accountAgreementAcceptance,
  farm,
  farmCertificate,
  farmInfoInternalApplication,
  farmLocation,
  user,
} from '@/lib/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import ApplicationTabs from './components/application-tabs';
import { redirect } from 'next/navigation';

/** The apply page
 *
 * @returns {JSX.Element} - The application page*/
export default async function Apply() {
  let currentUser;
  let farmId;
  let farmInfo;
  let allUsers;
  let internalApplication;

  try {
    currentUser = await getAuthenticatedInfo();

    if (currentUser.approved) {
      redirect('/');
    }

    const [hasApplied] = await db
      .select({ userId: accountAgreementAcceptance.userId })
      .from(accountAgreementAcceptance)
      .where(eq(accountAgreementAcceptance.userId, currentUser.id))
      .limit(1);

    if (hasApplied) {
      redirect('/application-success');
    }

    farmId = currentUser.farmId;
    [farmInfo] = await db
      .select()
      .from(farm)
      .where(eq(farm.id, farmId))
      .fullJoin(farmLocation, eq(farmLocation.farmId, farmId))
      .fullJoin(farmCertificate, eq(farmCertificate.farmId, farmId))
      .limit(1);

    // All users EXCEPT the current user
    allUsers = await db
      .select()
      .from(user)
      .where(and(eq(user.farmId, farmId), ne(user.id, currentUser.id)));

    [internalApplication] = await db
      .select()
      .from(farmInfoInternalApplication)
      .where(eq(farmInfoInternalApplication.farmId, farmId))
      .limit(1);
  } catch (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center max-w-[500px] w-[90vw] mx-auto">
        <h1>There was an error with authentication</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-8 w-[90vw] max-w-[800px]">
      <ApplicationTabs
        farmInfo={{
          ...farmInfo.farm,
          ...farmInfo.farm_location,
          ...farmInfo.farm_certificate,
        }}
        currentUser={currentUser}
        allUsers={allUsers}
        internalApplication={internalApplication}
      />
    </div>
  );
}
