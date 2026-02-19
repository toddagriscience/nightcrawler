// Copyright © Todd Agriscience, Inc. All rights reserved.

import { integratedManagementPlan } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { desc, eq } from 'drizzle-orm';
import EditableSummary from './editable-summary';

/** Static sidebar widget that displays IMP summaries for a given management zone, ordered from most recent to oldest.
 *
 * @param managementZoneId - The ID of the management zone to display summaries for
 * */
export default async function SummarySidebar({
  managementZoneId,
}: {
  managementZoneId: number;
}) {
  const imps = await db
    .select()
    .from(integratedManagementPlan)
    .where(eq(integratedManagementPlan.managementZone, managementZoneId))
    .orderBy(desc(integratedManagementPlan.initialized));

  if (imps.length === 0) {
    return (
      <div className="h-fit w-72 shrink-0 border bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold">Plan Summaries</h3>
        <p className="text-sm italic text-gray-400">
          No integrated management plans yet
        </p>
      </div>
    );
  }

  return (
    <div className="h-fit max-h-[calc(100vh-120px)] w-72 shrink-0 overflow-y-auto border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">Plan Summaries</h3>
      <div className="space-y-3">
        {imps.map((imp) => (
          <EditableSummary key={imp.id} imp={imp} />
        ))}
      </div>
    </div>
  );
}
