// Copyright © Todd Agriscience, Inc. All rights reserved.

import { accountAgreementAcceptance } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

/** Returns whether the given user has accepted the account agreement.
 *
 * This checks persisted acceptance state from the database.
 * Wrapped in React's `cache()` so repeated calls within the same server
 * request resolve once instead of issuing duplicate DB queries.
 */
export const hasAcceptedAccountAgreement = cache(
  async (userId: number): Promise<boolean> => {
    const [hasAccepted] = await db
      .select({ id: accountAgreementAcceptance.id })
      .from(accountAgreementAcceptance)
      .where(eq(accountAgreementAcceptance.userId, userId))
      .limit(1);

    return Boolean(hasAccepted);
  }
);
