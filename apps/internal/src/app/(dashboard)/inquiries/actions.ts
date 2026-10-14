// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { requireInternalAccount } from '@/lib/require-internal-account';
import { logger } from '@/lib/logger';
import { db } from '@nightcrawler/db';
import { farm, formSubmission } from '@nightcrawler/db/schema';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { ClientInquiry, HandleInquiryResult } from './types';

/** Loads authenticated Iris requests for authorized internal staff. */
export async function getClientInquiries(): Promise<ClientInquiry[]> {
  await requireInternalAccount();
  const rows = await db
    .select({
      id: formSubmission.id,
      farmId: formSubmission.farmId,
      farmName: farm.informalName,
      answers: formSubmission.answers,
      createdAt: formSubmission.createdAt,
      reviewedAt: formSubmission.reviewedAt,
    })
    .from(formSubmission)
    .leftJoin(farm, eq(formSubmission.farmId, farm.id))
    .where(
      and(
        eq(formSubmission.formSlug, 'iris-contact'),
        eq(formSubmission.workflowType, 'generic'),
        isNull(formSubmission.deletedAt)
      )
    )
    .orderBy(desc(formSubmission.createdAt));

  return rows.map((row) => ({
    id: row.id,
    farmId: row.farmId,
    farmName: row.farmName || 'Unknown farm',
    subject:
      typeof row.answers.subject === 'string'
        ? row.answers.subject
        : 'Contact request',
    message: typeof row.answers.message === 'string' ? row.answers.message : '',
    senderName:
      typeof row.answers.senderName === 'string'
        ? row.answers.senderName
        : 'Client',
    senderEmail:
      typeof row.answers.senderEmail === 'string'
        ? row.answers.senderEmail
        : '',
    createdAt: row.createdAt,
    reviewedAt: row.reviewedAt,
  }));
}

/** Marks an Iris contact request handled, attributing the review to this staff member. */
export async function markClientInquiryHandled(
  id: number
): Promise<HandleInquiryResult> {
  const reviewer = await requireInternalAccount();
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, message: 'Invalid request number.' };
  }
  try {
    const [row] = await db
      .update(formSubmission)
      .set({
        reviewedAt: new Date(),
        reviewedByInternalAccountId: reviewer.id,
      })
      .where(
        and(
          eq(formSubmission.id, id),
          eq(formSubmission.formSlug, 'iris-contact'),
          eq(formSubmission.workflowType, 'generic'),
          isNull(formSubmission.deletedAt),
          isNull(formSubmission.reviewedAt)
        )
      )
      .returning({ id: formSubmission.id });

    if (!row)
      return {
        success: false,
        message:
          'This request was already handled or is no longer available. Refresh the inbox.',
      };
    revalidatePath('/inquiries');
    return { success: true };
  } catch (error) {
    logger.error('Unable to mark a client inquiry handled', error);
    return {
      success: false,
      message: 'The request could not be updated. Please try again.',
    };
  }
}
