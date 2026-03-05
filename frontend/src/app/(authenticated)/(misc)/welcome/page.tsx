// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button } from '@/components/ui';
import { accountAgreementAcceptance, managementZone } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
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
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-between px-4">
      <div></div>
      <div className="space-y-5 text-center">
        <h1 className="text-foreground text-3xl font-bold">Welcome</h1>
        <p className="text-foreground text-base font-normal">
          Thank you for being a Todd client since{' '}
          {currentUser.createdAt.getFullYear()}.
        </p>
        {!currentUser.approved && hasApplied ? (
          <>
            <p>
              We&apos;ll take a look at your application as soon as possible.
            </p>
            <Button variant={'outline'} className="min-w-45">
              <Link href={'/contact'}>Schedule a meeting</Link>
            </Button>
          </>
        ) : !currentUser.approved && !hasApplied ? (
          <div className="flex flex-row items-center justify-center gap-6">
            <ApplyButton />
            <Button variant={'outline'} className="min-w-45">
              <Link href={'/contact'}>Schedule a meeting</Link>
            </Button>
          </div>
        ) : hasNoManagementZones ? (
          <>
            <p>
              You&apos;ve been approved. We&apos;ll reach out with more
              information as soon as possible.
            </p>
            <Button variant={'outline'} className="min-w-45">
              <Link href={'/contact'}>Schedule a meeting</Link>
            </Button>
          </>
        ) : null}
      </div>
      <Link
        href="/contact"
        className="text-foreground mt-4 inline-block text-base font-normal underline transition-opacity hover:opacity-70"
      >
        Experiencing an Issue?
      </Link>
    </div>
  );
}
