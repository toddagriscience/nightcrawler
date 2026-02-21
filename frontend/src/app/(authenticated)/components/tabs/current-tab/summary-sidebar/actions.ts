// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { integratedManagementPlan } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import logger from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { eq } from 'drizzle-orm';

/** Update the summary of an integrated management plan.
 *
 * @param impId - The ID of the integrated management plan to update
 * @param summary - The new summary text
 * */
export async function updateImpSummary(
  impId: number,
  summary: string
): Promise<ActionResponse> {
  try {
    await getAuthenticatedInfo();

    await db
      .update(integratedManagementPlan)
      .set({ summary })
      .where(eq(integratedManagementPlan.id, impId));

    return { error: null };
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update summary' };
  }
}
