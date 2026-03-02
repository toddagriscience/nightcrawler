// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { managementZone } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import logger from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import type { ManagementZoneInsert } from '@/lib/types/db';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateManagementZone(
  zoneId: number,
  input: ManagementZoneInsert
): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(zoneId)) {
      return { error: 'Invalid management zone id' };
    }

    const currentUser = await getAuthenticatedInfo();

    if (!currentUser.farmId) {
      return { error: 'User is not associated with a farm' };
    }

    await db
      .update(managementZone)
      .set({
        ...input,
      })
      .where(
        and(
          eq(managementZone.id, zoneId),
          eq(managementZone.farmId, currentUser.farmId)
        )
      )
      .returning({ id: managementZone.id });

    revalidatePath('/account/management-zones');
    revalidatePath(`/account/management-zones/${zoneId}`);

    return { error: null };
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: 'Failed to update management zone' };
  }
}
