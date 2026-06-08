// Copyright © Todd Agriscience, Inc. All rights reserved.

import { integratedManagementPlan } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { desc } from 'drizzle-orm';

export async function getAllImps() {
  return db
    .select({
      id: integratedManagementPlan.id,
      title: integratedManagementPlan.title,
      slug: integratedManagementPlan.slug,
      category: integratedManagementPlan.category,
      source: integratedManagementPlan.source,
      updated: integratedManagementPlan.updated,
    })
    .from(integratedManagementPlan)
    .orderBy(desc(integratedManagementPlan.updated));
}
