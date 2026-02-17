// Copyright © Todd Agriscience, Inc. All rights reserved.

import { WidgetSelect } from '@/lib/types/db';
import MineralLevelWidget from '../mineral-level-widget/mineral-level-widget';
import WidgetDeleteButton from './widget-delete-button';
import { NamedTab } from '@/app/(authenticated)/components/tabs/types';
import { db } from '@/lib/db/schema/connection';
import { analysis, mineral } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { MineralChartType } from '../mineral-level-widget/types';

export default async function WidgetWrapper({
  widget,
  currentTab,
}: {
  widget: WidgetSelect;
  currentTab: NamedTab;
}) {
  switch (widget.name) {
    case 'Macro Radar':
      return <p>Macro Radar Widget - Coming Soon</p>;

    case 'Calcium Widget':
      const calciumReadings = await db
        .select({
          unit: mineral.units,
          realValue: mineral.realValue,
          createdAt: mineral.createdAt,
        })
        .from(analysis)
        .where(eq(analysis.managementZone, currentTab.managementZone))
        .innerJoin(
          mineral,
          and(eq(analysis.id, mineral.analysisId), eq(mineral.name, 'Calcium'))
        )
        .orderBy(mineral.createdAt);

      if (calciumReadings.length === 0) {
        return <p>No calcium data currently available</p>;
      }

      const lastUpdated = calciumReadings.at(-1)!.createdAt;

      // The actual data
      const chartData: MineralChartType[] = calciumReadings.map((reading) => ({
        y: 0,
        x: Number(reading.realValue),
        date: reading.createdAt,
        unit: reading.unit,
      }));

      return (
        <>
          <div className="flex flex-row justify-between">
            <h2>Calcium</h2>
            <p>Last Updated {lastUpdated.toLocaleDateString()}</p>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget max={10} min={0} chartData={chartData}>
            <div className="col-start-1 row-start-1 flex h-full w-full flex-row gap-1">
              <div
                className={`flex h-5 basis-1/3 items-center justify-center rounded-xl bg-yellow-500/30`}
              >
                <p className="mx-auto mb-[2px] max-h-full text-center text-sm font-light text-black/90">
                  Low
                </p>
              </div>
              <div className={`h-5 basis-1/3 rounded-xl bg-green-500/30`}>
                <p className="mx-auto mb-[2px] max-h-full text-center text-sm font-light text-black/70">
                  Ideal
                </p>
              </div>
              <div className={`h-5 basis-1/3 rounded-xl bg-yellow-500/30`}>
                <p className="mx-auto mb-[2px] max-h-full text-center text-sm font-light text-black/90">
                  High
                </p>
              </div>
            </div>
          </MineralLevelWidget>
        </>
      );

    default:
      return (
        <>
          <h3 className="mb-2 text-lg font-semibold">Unknown Widget</h3>
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Widget type &quot;{widget.name}&quot; not found
          </div>
        </>
      );
  }
}
