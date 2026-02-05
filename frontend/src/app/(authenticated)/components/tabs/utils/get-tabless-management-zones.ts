// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { managementZone, tab } from '@/lib/db/schema';
import { and, eq, notExists } from 'drizzle-orm';
import { db } from '@/lib/db/schema/connection';
import { ManagementZoneSelect } from '@/lib/types/db';

// Gets all management zones that don't currently have a tab
export async function getTablessManagementZones(farmId: number) {
  const managementZones = await db
    .select({ managementZone })
    .from(managementZone)
    .where(
      and(
        eq(managementZone.farmId, farmId),
        notExists(
          db
            .select({ id: tab.id })
            .from(tab)
            .where(eq(managementZone.id, tab.managementZone))
        )
      )
    );

  // The following is a bit sloppy, couldn't figure out querying. It'll do for now though, most farms won't have more than 10 zones.
  const flattenedManagementZones: ManagementZoneSelect[] = managementZones.map(
    (row) => row.managementZone
  );

  return flattenedManagementZones;
}
