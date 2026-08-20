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

/**
 * Narrows a client payload to the management zone columns the form may write.
 *
 * `id`, `farmId`, `createdAt`, and `updatedAt` are deliberately excluded. The
 * edit form seeds react-hook-form's `defaultValues` from the whole zone row, so
 * every submission posts those identity columns back; spreading the payload
 * straight into `.set()` therefore let a farm Admin rewrite them — reassigning
 * their zone to another farm via `farmId`, or colliding a primary key via `id`.
 * The `.where()` clause scopes *which* row is updated to the caller's farm, but
 * places no constraint on *what* is written to it.
 *
 * `undefined` values are dropped so untouched fields keep their stored value,
 * while `null` is preserved — it is how the form clears an optional date.
 *
 * @param input - Raw management zone payload from the client
 * @returns The subset of columns that are safe to write
 */
function pickEditableManagementZoneFields(
  input: ManagementZoneInsert
): Partial<ManagementZoneInsert> {
  const editable: Partial<ManagementZoneInsert> = {
    name: input.name,
    location: input.location,
    rotationYear: input.rotationYear,
    npk: input.npk,
    npkLastUsed: input.npkLastUsed,
    irrigation: input.irrigation,
    waterConservation: input.waterConservation,
  };

  return Object.fromEntries(
    Object.entries(editable).filter(([, value]) => value !== undefined)
  ) as Partial<ManagementZoneInsert>;
}

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

    const updates = pickEditableManagementZoneFields(input);

    if (Object.keys(updates).length === 0) {
      throwActionError('No management zone fields to update');
    }

    await db
      .update(managementZone)
      .set(updates)
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

export async function deleteManagementZone(
  zoneId: number
): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(zoneId)) {
      throwActionError('Invalid management zone id');
    }

    const currentUser = await getAuthenticatedInfo();

    if (!currentUser.farmId) {
      throwActionError('User is not associated with a farm');
    }

    assertCanEditFarm(currentUser, 'delete-tab');

    await db
      .delete(managementZone)
      .where(
        and(
          eq(managementZone.id, zoneId),
          eq(managementZone.farmId, currentUser.farmId)
        )
      );

    revalidatePath('/');

    return {};
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }

    throwActionError('Failed to delete management zone');
  }
}

export async function createManagementZone(
  name: string
): Promise<ActionResponse> {
  try {
    const currentUser = await getAuthenticatedInfo();

    if (!currentUser.farmId) {
      throwActionError('User is not associated with a farm');
    }

    assertCanEditFarm(currentUser, 'create-tab');

    if (!name.trim()) {
      throwActionError('Zone name is required');
    }

    const [newZone] = await db
      .insert(managementZone)
      .values({
        farmId: currentUser.farmId,
        name: name.trim(),
      })
      .returning({ id: managementZone.id });

    revalidatePath('/');

    return { data: { id: newZone.id } };
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }

    throwActionError('Failed to create management zone');
  }
}
