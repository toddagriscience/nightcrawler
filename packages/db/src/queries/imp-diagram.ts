// Copyright © Todd Agriscience, Inc. All rights reserved.

import { db } from '../schema/connection';
import {
  generalImp,
  integratedManagementPlan,
  managementZone,
} from '../schema';
import { and, eq, isNull, or, sql } from 'drizzle-orm';
import { impDiagramNamePattern } from '../utils/imp-diagram';

/** Only diagrams referenced by shared practices or this farm's plans are readable. */
export async function canReadImpDiagram(
  name: string,
  farmId: number
): Promise<boolean> {
  if (
    !impDiagramNamePattern.test(name) ||
    !Number.isSafeInteger(farmId) ||
    farmId < 1
  )
    return false;
  const reference = `/api/imp-diagrams/${name}`;
  const [shared] = await db
    .select({ id: generalImp.id })
    .from(generalImp)
    .where(sql`position(${reference} in ${generalImp.content}) > 0`)
    .limit(1);
  if (shared) return true;
  const [plan] = await db
    .select({ id: integratedManagementPlan.id })
    .from(integratedManagementPlan)
    .leftJoin(
      managementZone,
      eq(managementZone.id, integratedManagementPlan.managementZone)
    )
    .where(
      and(
        sql`position(${reference} in ${integratedManagementPlan.content}) > 0`,
        or(
          isNull(integratedManagementPlan.managementZone),
          eq(managementZone.farmId, farmId)
        )
      )
    )
    .limit(1);
  return Boolean(plan);
}
