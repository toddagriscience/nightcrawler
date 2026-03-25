// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import termsAndConditionsVersion from '@/app/(authenticated)/(misc)/apply/terms-and-conditions-version';
import { ActionResponse } from '@/lib/types/action-response';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { throwActionError } from '@/lib/utils/actions';
import { accountAgreementAcceptance } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

/** Accept account agreement for authenticated users that have not accepted yet. */
export async function acceptAccountAgreement(): Promise<ActionResponse> {
  const timeAccepted = new Date();
  const requestHeaders = await headers();
  const userIpAddress = requestHeaders.get('x-forwarded-for');

  try {
    const currentUser = await getAuthenticatedInfo();

    const [hasAccepted] = await db
      .select({ id: accountAgreementAcceptance.id })
      .from(accountAgreementAcceptance)
      .where(eq(accountAgreementAcceptance.userId, currentUser.id))
      .limit(1);

    if (hasAccepted) {
      return {};
    }

    if (currentUser.role !== 'Viewer') {
      throwActionError(
        'Only viewers can submit this agreement from this page.'
      );
    }

    await db.insert(accountAgreementAcceptance).values({
      timeAccepted,
      ipAddress: userIpAddress || 'NO x-forwarded-for HEADER GIVEN',
      userId: currentUser.id,
      accepted: true,
      version: termsAndConditionsVersion,
    });

    return {};
  } catch (error) {
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Unknown error');
  }
}
