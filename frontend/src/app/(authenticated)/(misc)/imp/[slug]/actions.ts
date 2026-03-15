// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { logger } from '@/lib/logger';
import { db } from '@/lib/db/schema/connection';
import {
  integratedManagementPlanNote,
  knowledgeArticle,
} from '@/lib/db/schema';
import type { ActionResponse } from '@/lib/types/action-response';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function saveImpNotes(
  articleId: number,
  notes: string
): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(articleId)) {
      return { error: 'Invalid IMP id' };
    }

    const currentUser = await getAuthenticatedInfo();

    if (!currentUser.approved) {
      return { error: 'Your farm is not approved to access IMPs.' };
    }

    const [article] = await db
      .select({
        id: knowledgeArticle.id,
        slug: knowledgeArticle.slug,
      })
      .from(knowledgeArticle)
      .where(
        and(
          eq(knowledgeArticle.id, articleId),
          eq(knowledgeArticle.articleType, 'imp')
        )
      )
      .limit(1);

    if (!article) {
      return { error: 'IMP not found' };
    }

    const normalizedNotes = notes.trim();

    if (normalizedNotes.length === 0) {
      await db
        .delete(integratedManagementPlanNote)
        .where(
          and(
            eq(integratedManagementPlanNote.knowledgeArticleId, article.id),
            eq(integratedManagementPlanNote.userId, currentUser.id)
          )
        );

      revalidatePath(`/imp/${article.slug}`);

      return {
        data: {
          notes: '',
          updatedAt: null,
        },
        error: null,
      };
    }

    const [savedNote] = await db
      .insert(integratedManagementPlanNote)
      .values({
        knowledgeArticleId: article.id,
        userId: currentUser.id,
        notes: normalizedNotes,
      })
      .onConflictDoUpdate({
        target: [
          integratedManagementPlanNote.knowledgeArticleId,
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
      error: null,
    };
  } catch (error) {
    logger.error('[saveImpNotes] Failed to save notes:', error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: 'Failed to save IMP notes' };
  }
}
