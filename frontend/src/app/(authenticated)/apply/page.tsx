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
import { isVerified } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import logger from '@/lib/logger';

/** The apply page
 *
 * @returns {JSX.Element} - The application page*/
export default async function Apply() {
  const currentUser = await getAuthenticatedInfo();

  if ('error' in currentUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center max-w-[500px] w-[90vw] mx-auto">
        <h1>There was an error with authentication</h1>
        <p>{currentUser.error}</p>
      </div>
    );
  }

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

  /**
    * get_email_verification_from_email is equivalent to the following function:
    * 
      begin
        return (select email_verified_at from auth.users where email = email_address limit 1);
      end;
    * 
    * email_verified_at is either null or a timestamp.
    * */

  const supabase = await createClient();

  // Verification status of invited users. A user is verified if they've clicked on the invitation link in their email
  const invitedUserVerificationStatus = await Promise.all(
    allUsers.map(async (user) => {
      const { data, error } = await supabase.rpc(
        'get_email_verification_from_email',
        {
          email_address: user.email,
        }
      );

      if (error) {
        logger.error(error);

        return {
          email: user.email,
          verified: false,
        };
      }

      return {
        email: user.email,
        verified: Boolean(data),
      };
    })
  );

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
        currentUser={currentUser}
        allUsers={allUsers}
        internalApplication={internalApplication}
        invitedUserVerificationStatus={invitedUserVerificationStatus}
      />
    </div>
  );
}
