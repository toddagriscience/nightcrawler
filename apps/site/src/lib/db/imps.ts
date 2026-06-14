// Copyright © Todd Agriscience, Inc. All rights reserved.

import { integratedManagementPlan } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { desc } from 'drizzle-orm';

/**
 * Fetches all integrated management plans (IMPs) for the search modal.
 *
 * @returns A list of IMPs ordered by most recently updated first.
 */
export async function getAllImps() {
  return db
    .select({
      id: integratedManagementPlan.id,
      title: integratedManagementPlan.title,
      slug: integratedManagementPlan.slug,
      content: integratedManagementPlan.content,
      category: integratedManagementPlan.category,
      source: integratedManagementPlan.source,
      updated: integratedManagementPlan.updated,
    })
    .from(integratedManagementPlan)
    .orderBy(desc(integratedManagementPlan.updated));
}
