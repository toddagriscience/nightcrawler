// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import ApplyButton from './apply-button';
import { db } from '@/lib/db/schema/connection';
import { accountAgreementAcceptance } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function Landing() {
  const currentUser = await getAuthenticatedInfo();

  if ('error' in currentUser) {
    return (
      <div>
        <p>{currentUser.error}</p>
      </div>
    );
  }

  const [hasApplied] = await db
    .select({ userId: accountAgreementAcceptance.userId })
    .from(accountAgreementAcceptance)
    .where(eq(accountAgreementAcceptance.userId, currentUser.id))
    .limit(1);

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-8rem)] px-4">
      <div></div>
      <div className="text-center space-y-4">
        <h1 className="text-foreground text-3xl font-bold">Welcome</h1>
        <p className="text-foreground text-base font-normal">
          Thank you for being a Todd client since 2025
        </p>
        {hasApplied ? (
          <p>We&apos;ll take a look at your application as soon as possible.</p>
        ) : (
          <ApplyButton />
        )}
      </div>
      <Link
        href="/contact"
        className="text-foreground text-base font-normal underline hover:opacity-70 transition-opacity inline-block mt-4"
      >
        Experiencing an Issue?
      </Link>
    </div>
  );
}
