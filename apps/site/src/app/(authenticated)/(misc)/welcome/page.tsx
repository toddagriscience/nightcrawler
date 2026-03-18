// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button } from '@/components/ui/button';
import {
  accountAgreementAcceptance,
  managementZone,
} from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import ApplyButton from '../../components/apply-button';

/** The page that is shown when a user is either not approved or is approved but has no tabs or management zones */
export default async function Landing() {
  const currentUser = await getAuthenticatedInfo();
  const managementZones = await db
    .select({ id: managementZone.id })
    .from(managementZone)
    .where(eq(managementZone.farmId, currentUser.farmId));
  const hasNoManagementZones = managementZones.length === 0;
  const [hasApplied] = await db
    .select({ userId: accountAgreementAcceptance.userId })
    .from(accountAgreementAcceptance)
    .where(eq(accountAgreementAcceptance.userId, currentUser.id))
    .limit(1);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-between">
      <div></div>
      <div className="space-y-10 text-center">
        <div className="space-y-6">
          <h1 className="text-foreground text-5xl font-thin">Welcome</h1>
          <p className="text-foreground text-lg font-thin">
            Thank you for being a Todd client since{' '}
            {currentUser.createdAt.getFullYear()}.
          </p>
        </div>
        {!currentUser.approved && hasApplied ? (
          <>
            <p className="text-foreground text-xl font-normal border-b border-[0#D9D9D9] pb-10">
              We&apos;ll take a look at your application as soon as possible.
            </p>
            <Link href={'/contact'}>
              <Button
                variant="outline"
                className="h-11 w-45 bg-transparent rounded-full text-foreground hover:text-white hover:bg-foreground"
              >
                Schedule a meeting
              </Button>
            </Link>
          </>
        ) : !currentUser.approved && !hasApplied ? (
          <div className="flex flex-row items-center justify-center gap-6 border-t border-[#D9D9D9] pt-10">
            <ApplyButton />
            <Link href={'/contact'}>
              <Button
                variant="outline"
                className="h-11 w-45 bg-transparent rounded-full text-foreground hover:text-white hover:bg-foreground"
              >
                Schedule a meeting
              </Button>
            </Link>
          </div>
        ) : hasNoManagementZones ? (
          <>
            <p className="text-foreground text-lg font-normal mx-auto border-b border-[#D9D9D9] pb-10">
              You&apos;ve been approved! <br /> We&apos;ll reach out with more
              information as soon as possible.
            </p>
            <Link href={'/contact'}>
              <Button
                variant="outline"
                className="h-11 w-45 bg-transparent rounded-full text-foreground hover:text-white hover:bg-foreground"
              >
                Schedule a meeting
              </Button>
            </Link>
          </>
        ) : null}
      </div>
      <Link
        href="/contact"
        className="text-foreground mt-4 inline-block text-sm font-normal underline transition-opacity hover:opacity-70"
      >
        Experiencing an Issue?
      </Link>
    </div>
  );
}
