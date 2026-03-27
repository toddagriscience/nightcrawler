// Copyright © Todd Agriscience, Inc. All rights reserved.

import { integratedManagementPlan } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { eq } from 'drizzle-orm';

export async function getImpArticleBySlug(slug: string) {
  const [article] = await db
    .select({
      id: integratedManagementPlan.id,
      title: integratedManagementPlan.title,
      slug: integratedManagementPlan.slug,
      content: integratedManagementPlan.content,
      category: integratedManagementPlan.category,
      source: integratedManagementPlan.source,
    })
    .from(integratedManagementPlan)
    .where(eq(integratedManagementPlan.slug, slug))
    .limit(1);

  return article;
}
