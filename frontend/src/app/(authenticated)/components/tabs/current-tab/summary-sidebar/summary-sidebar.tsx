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
    .orderBy(desc(integratedManagementPlan.createdAt));

  return (
    <div className="mt-11 mr-3 h-[85vh] w-80 shrink-0 border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">IMP Summaries</h3>
      <div className="space-y-3">
        {imps.length > 0 ? (
          imps.map((imp) => <EditableSummary key={imp.id} imp={imp} />)
        ) : (
          <p className="text-sm text-gray-400 italic">
            No integrated management plans yet
          </p>
        )}
      </div>
    </div>
  );
}
