// Copyright © Todd Agriscience, Inc. All rights reserved.

import { knowledgeArticle } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { and, eq } from 'drizzle-orm';

export async function getImpArticleBySlug(slug: string) {
  const [article] = await db
    .select({
      id: knowledgeArticle.id,
      title: knowledgeArticle.title,
      slug: knowledgeArticle.slug,
      content: knowledgeArticle.content,
      category: knowledgeArticle.category,
      source: knowledgeArticle.source,
    })
    .from(knowledgeArticle)
    .where(
      and(
        eq(knowledgeArticle.slug, slug),
        eq(knowledgeArticle.articleType, 'imp')
      )
    )
    .limit(1);

  return article;
}
