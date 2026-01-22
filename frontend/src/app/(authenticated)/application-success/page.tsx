// Copyright © Todd Agriscience, Inc. All rights reserved.

import { accountAgreementAcceptance } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function ApplicationSuccess() {
  const currentUser = await getAuthenticatedInfo();

  if ('error' in currentUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center max-w-[500px] w-[90vw] mx-auto">
        <h1>There was an error with authentication</h1>
        <p>{currentUser.error}</p>
      </div>
    );
  }

  const [hasApplied] = await db
    .select({ userId: accountAgreementAcceptance.userId })
    .from(accountAgreementAcceptance)
    .where(eq(accountAgreementAcceptance.userId, currentUser.id))
    .limit(1);

  if (!hasApplied) {
    redirect('/');
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col justify-center items-center">
      <h1 className="text-3xl">Thanks for submitting your application</h1>
      <p>We&apos;ll reach out to you as soon as possible.</p>
    </div>
  );
}
