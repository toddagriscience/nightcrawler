// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { managementZone } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import logger from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import type { ManagementZoneInsert } from '@/lib/types/db';
import { throwActionError } from '@/lib/utils/actions';
import { assertCanEditFarm } from '@/lib/utils/farm-rbac';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateManagementZone(
  zoneId: number,
  input: ManagementZoneInsert
): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(zoneId)) {
      throwActionError('Invalid management zone id');
    }

    const currentUser = await getAuthenticatedInfo();

    if (!currentUser.farmId) {
      throwActionError('User is not associated with a farm');
    }

    assertCanEditFarm(currentUser, 'update-management-zone');

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

    return {};
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }

    throwActionError('Failed to update management zone');
  }
}
