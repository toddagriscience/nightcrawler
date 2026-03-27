// Copyright © Todd Agriscience, Inc. All rights reserved.

import { accountAgreementAcceptance } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { eq } from 'drizzle-orm';

/** Returns whether the given user has accepted the account agreement.
 *
 * This checks persisted acceptance state from the database.
 */
export async function hasAcceptedAccountAgreement(
  userId: number
): Promise<boolean> {
  const [hasAccepted] = await db
    .select({ id: accountAgreementAcceptance.id })
    .from(accountAgreementAcceptance)
    .where(eq(accountAgreementAcceptance.userId, userId))
    .limit(1);

  return Boolean(hasAccepted);
}
