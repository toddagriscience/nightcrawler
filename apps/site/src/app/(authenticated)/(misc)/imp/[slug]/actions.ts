// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { logger } from '@/lib/logger';
import { db } from '@nightcrawler/db/schema/connection';
import {
  integratedManagementPlan,
  integratedManagementPlanNote,
} from '@nightcrawler/db/schema';
import type { ActionResponse } from '@/lib/types/action-response';
import { throwActionError } from '@/lib/utils/actions';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function saveImpNotes(
  articleId: number,
  notes: string
): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(articleId)) {
      throwActionError('Invalid IMP id');
    }

    const currentUser = await getAuthenticatedInfo();

    if (!currentUser.approved) {
      throwActionError('Your farm is not approved to access IMPs.');
    }

    const [article] = await db
      .select({
        id: integratedManagementPlan.id,
        slug: integratedManagementPlan.slug,
      })
      .from(integratedManagementPlan)
      .where(eq(integratedManagementPlan.id, articleId))
      .limit(1);

    if (!article) {
      throwActionError('IMP not found');
    }

    const normalizedNotes = notes.trim();

    if (normalizedNotes.length === 0) {
      await db
        .delete(integratedManagementPlanNote)
        .where(
          and(
            eq(
              integratedManagementPlanNote.integratedManagementPlanId,
              article.id
            ),
            eq(integratedManagementPlanNote.userId, currentUser.id)
          )
        );

      revalidatePath(`/imp/${article.slug}`);

      return {
        data: {
          notes: '',
          updatedAt: null,
        },
      };
    }

    const [savedNote] = await db
      .insert(integratedManagementPlanNote)
      .values({
        integratedManagementPlanId: article.id,
        userId: currentUser.id,
        notes: normalizedNotes,
      })
      .onConflictDoUpdate({
        target: [
          integratedManagementPlanNote.integratedManagementPlanId,
          integratedManagementPlanNote.userId,
        ],
        set: {
          notes: normalizedNotes,
          updatedAt: new Date(),
        },
      })
      .returning({
        notes: integratedManagementPlanNote.notes,
        updatedAt: integratedManagementPlanNote.updatedAt,
      });

    revalidatePath(`/imp/${article.slug}`);

    return {
      data: {
        notes: savedNote.notes,
        updatedAt: savedNote.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    logger.error('[saveImpNotes] Failed to save notes:', error);

    if (error instanceof Error) {
      throwActionError(error.message);
    }

    throwActionError('Failed to save IMP notes');
  }
}
