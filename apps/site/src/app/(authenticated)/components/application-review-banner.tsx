// Copyright © Todd Agriscience, Inc. All rights reserved.

import { accountAgreementAcceptance } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { eq } from 'drizzle-orm';

/**
 * Site-wide banner for farms that have submitted an application but are not
 * yet approved (`farm.approved`). Hidden once the farm is approved.
 */
export default async function ApplicationReviewBanner() {
  let currentUser;
  try {
    currentUser = await getAuthenticatedInfo();
  } catch {
    return null;
  }

  if (currentUser.approved) {
    return null;
  }

  const [hasApplied] = await db
    .select({ userId: accountAgreementAcceptance.userId })
    .from(accountAgreementAcceptance)
    .where(eq(accountAgreementAcceptance.userId, currentUser.id))
    .limit(1);

  if (!hasApplied) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-amber-400/50 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950"
    >
      Your application is in review. We&apos;ll email you with updates and may
      reach out with questions.
    </div>
  );
}
