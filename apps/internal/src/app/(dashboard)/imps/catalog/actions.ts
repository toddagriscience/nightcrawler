// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { createHash } from 'node:crypto';
import { db } from '@nightcrawler/db';
import { generalImp, knowledgeArticle } from '@nightcrawler/db/schema';
import { getEmbedding } from '@nightcrawler/db/utils/get-embedding';
import { generalImpEmbeddingText } from '@nightcrawler/db/utils/general-imp-content';
import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireInternalAccount } from '@/lib/require-internal-account';
import { logger } from '@/lib/logger';
import { generalImpFieldsSchema } from './utils';
import type { SaveGeneralImpResult } from './types';

/** Loads the catalog separately from farm-specific integrated management plans. */
export async function getGeneralImps() {
  await requireInternalAccount();
  return db.select().from(generalImp).orderBy(asc(generalImp.slug));
}

/** Saves the body and its search embedding atomically, retaining existing URLs. */
export async function saveGeneralImp(
  input: unknown,
  existing?: { id: number; updatedAt: string }
): Promise<SaveGeneralImpResult> {
  await requireInternalAccount();
  const parsed = generalImpFieldsSchema.safeParse(input);
  if (
    !parsed.success ||
    (existing &&
      (!Number.isSafeInteger(existing.id) ||
        existing.id < 1 ||
        !Number.isFinite(Date.parse(existing.updatedAt))))
  ) {
    return {
      ok: false,
      error: 'Check the title, slug, tags, trigger and body.',
    };
  }
  const fields = {
    title: parsed.data.title || null,
    slug: parsed.data.slug,
    tags: parsed.data.tags,
    triggerRaw: parsed.data.triggerRaw || null,
    content: parsed.data.content,
  };
  try {
    const text = generalImpEmbeddingText(fields);
    const sourceContentHash = createHash('sha256').update(text).digest('hex');
    // Embedding failure must not change the catalog or insert an orphan article.
    const embedding = await getEmbedding(text);
    const imp = await db.transaction(async (tx) => {
      if (existing) {
        const [current] = await tx
          .select()
          .from(generalImp)
          .where(eq(generalImp.id, existing.id))
          .for('update');
        if (
          !current ||
          current.updatedAt.toISOString() !== existing.updatedAt
        ) {
          throw new Error('catalog-conflict');
        }
        await tx
          .update(knowledgeArticle)
          .set({ embedding })
          .where(eq(knowledgeArticle.id, current.knowledgeArticleId));
        const [updated] = await tx
          .update(generalImp)
          .set({ ...fields, slug: current.slug, sourceContentHash })
          .where(eq(generalImp.id, current.id))
          .returning();
        return updated;
      }
      const [article] = await tx
        .insert(knowledgeArticle)
        .values({ embedding })
        .returning({ id: knowledgeArticle.id });
      const [created] = await tx
        .insert(generalImp)
        .values({
          ...fields,
          knowledgeArticleId: article.id,
          sourceContentHash,
        })
        .returning();
      return created;
    });
    revalidatePath('/imps/catalog');
    revalidatePath(`/imp/general/${imp.slug}`);
    return { ok: true, imp };
  } catch (error) {
    if (error instanceof Error && error.message === 'catalog-conflict') {
      return {
        ok: false,
        error:
          'This IMP changed since you opened it. Reload the catalog before editing.',
      };
    }
    logger.error('Failed to save general IMP:', error);
    return {
      ok: false,
      error:
        'The IMP could not be saved. Check the slug is unique and the database and embedding service are configured.',
    };
  }
}
