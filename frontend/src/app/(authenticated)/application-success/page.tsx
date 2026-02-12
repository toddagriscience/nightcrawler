// Copyright © Todd Agriscience, Inc. All rights reserved.

import { accountAgreementAcceptance } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ApplicationSuccess() {
  const currentUser = await getAuthenticatedInfo();
  const [hasApplied] = await db
    .select({ userId: accountAgreementAcceptance.userId })
    .from(accountAgreementAcceptance)
    .where(eq(accountAgreementAcceptance.userId, currentUser.id))
    .limit(1);

  if (!hasApplied) {
    redirect('/');
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col justify-center items-center gap-4">
      <h1 className="text-3xl">Thanks for submitting your application</h1>
      <p>We&apos;ll reach out to you as soon as possible.</p>
      <Link href={'/'} className="underline">
        Home
      </Link>
    </div>
  );
}
