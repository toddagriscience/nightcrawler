// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { managementZone, tab } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { ActionResponse } from '@/lib/types/action-response';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import { and, eq } from 'drizzle-orm';

/** Update the name of a tab, which is actually the name of the related management zone.
 *
 * @param newName - The new name of the tab
 * @param oldName - The old name of the tab
 * @param tabId - The ID of the tab. If oldName is provided, this will not be used.
 * */
export default async function updateTabName(
  newName: string,
  oldName?: string,
  tabId?: number
): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedInfo();

    if ('error' in result) {
      return result;
    }

    if (!result.id || !result.farmId) {
      return { error: 'No user or farm ID provided in database model' };
    }

    const userId = result.id;
    const farmId = result.farmId;

    if (!oldName && !tabId) {
      return { error: 'Please provide either oldName or tabId' };
    }

    if (oldName) {
      await db
        .update(managementZone)
        .set({ name: newName })
        .where(
          and(
            eq(managementZone.name, oldName),
            eq(managementZone.farmId, farmId)
          )
        );
    } else if (tabId) {
      const [zone] = await db
        .select({ id: tab.id })
        .from(tab)
        .where(and(eq(tab.user, userId), eq(tab.id, tabId)))
        .limit(1);

      await db
        .update(managementZone)
        .set({ name: newName })
        .where(eq(managementZone.id, zone.id));
    }

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update tab' };
  }
}

/** Deletes a tab given the name or the id of the tab.
 *
 * @param name - Name of the tab (AKA the name of the management zone)
 * @param tabId - The literal id of the tab
 * */
export async function deleteTab(
  name?: string,
  tabId?: number
): Promise<ActionResponse> {
  try {
    const result = await getAuthenticatedInfo();

    if ('error' in result) {
      return result;
    }

    if (!result.id || !result.farmId) {
      return { error: 'No user or farm ID provided in database' };
    }

    const userId = result.id;
    const farmId = result.farmId;

    if (!name && !tabId) {
      return { error: 'Please provide either oldName or tabId' };
    }

    if (name) {
      const [zone] = await db
        .select({ id: managementZone.id })
        .from(managementZone)
        .where(
          and(eq(managementZone.name, name), eq(managementZone.farmId, farmId))
        );

      await db
        .delete(tab)
        .where(and(eq(tab.user, userId), eq(tab.managementZone, zone.id)));
    } else if (tabId) {
      await db.delete(tab).where(eq(tab.id, tabId));
    }

    return { error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to delete tab' };
  }
}
