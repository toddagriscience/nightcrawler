// Copyright © Todd Agriscience, Inc. All rights reserved.

import { analysis } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { desc, eq } from 'drizzle-orm';

/** Static sidebar widget that displays the most recent analysis insight for a given management zone.
 *
 * @param managementZoneId - The ID of the management zone to display insights for
 * */
export default async function SummarySidebar({
  managementZoneId,
}: {
  managementZoneId: number;
}) {
  const [latestAnalysis] = await db
    .select({
      id: analysis.id,
      summary: analysis.summary,
      analysisDate: analysis.analysisDate,
    })
    .from(analysis)
    .where(eq(analysis.managementZone, managementZoneId))
    .orderBy(desc(analysis.analysisDate))
    .limit(1);

  return (
    <div className="mt-11 mr-3 h-[85vh] w-80 shrink-0 border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">Insights</h3>
      <div className="space-y-3">
        {latestAnalysis?.summary ? (
          <div className="border-b pb-3 last:border-b-0">
            <p className="mb-1 text-xs font-medium text-gray-500">
              {latestAnalysis.analysisDate.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700">{latestAnalysis.summary}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No insights yet</p>
        )}
      </div>
    </div>
  );
}
