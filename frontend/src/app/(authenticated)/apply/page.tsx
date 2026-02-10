// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  accountAgreementAcceptance,
  farm,
  farmCertificate,
  farmInfoInternalApplication,
  farmLocation,
  user,
} from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq, ne } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import ApplicationTabs from './components/application-tabs';

/** The apply page
 *
 * @returns {JSX.Element} - The application page*/
export default async function Apply() {
  try {
    const currentUser = await getAuthenticatedInfo();
    const [hasApplied] = await db
      .select({ userId: accountAgreementAcceptance.userId })
      .from(accountAgreementAcceptance)
      .where(eq(accountAgreementAcceptance.userId, currentUser.id))
      .limit(1);

    const farmId = currentUser.farmId!;
    const [farmInfo] = await db
      .select()
      .from(farm)
      .where(eq(farm.id, farmId))
      .fullJoin(farmLocation, eq(farmLocation.farmId, farmId))
      .fullJoin(farmCertificate, eq(farmCertificate.farmId, farmId))
      .limit(1);

    // All users EXCEPT the current user
    const allUsers = await db
      .select()
      .from(user)
      .where(and(eq(user.farmId, farmId), ne(user.id, currentUser.id)));

    const [internalApplication] = await db
      .select()
      .from(farmInfoInternalApplication)
      .where(eq(farmInfoInternalApplication.farmId, farmId))
      .limit(1);

    if (currentUser.approved) {
      redirect('/');
    }

    if (hasApplied) {
      redirect('/application-success');
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
  } catch (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center max-w-[500px] w-[90vw] mx-auto">
        <h1>There was an error with authentication</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
