// Copyright © Todd Agriscience, Inc. All rights reserved.

import { farm, farmSubscription, user } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import logger from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasCompletedPlatformOnboarding } from '@/lib/utils/platform-onboarding';
import { and, eq, ne } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import ApplicationTabs from './components/application-tabs';
import { isApplicationReadyForSubmission } from './db';

/** The apply page
 *
 * @returns {JSX.Element} - The application page*/
export default async function Apply() {
  const currentUser = await getAuthenticatedInfo();

  const farmId = currentUser.farmId;
  const [farmRecord] = await db
    .select({ id: farm.id, informalName: farm.informalName })
    .from(farm)
    .where(eq(farm.id, farmId))
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

  const [subscription] = await db
    .select()
    .from(farmSubscription)
    .where(eq(farmSubscription.farmId, farmId))
    .limit(1);

  const canSubmitApplication = await isApplicationReadyForSubmission(farmId);

  const onboardingComplete = await hasCompletedPlatformOnboarding(
    currentUser.id,
    currentUser.approved
  );

  if (onboardingComplete) {
    redirect('/');
  }

  return (
    <div className="mx-auto mb-8 w-[90vw] max-w-[550px]">
      <ApplicationTabs
        farmInfo={{
          farmId,
          informalName: farmRecord?.informalName ?? undefined,
        }}
        currentUser={currentUser}
        allUsers={allUsers}
        internalApplication={{ farmId }}
        farmSubscription={subscription ?? null}
        invitedUserVerificationStatus={invitedUserVerificationStatus}
        canSubmitApplication={canSubmitApplication}
      />
    </div>
  );
}
