// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NamedTab } from '@/app/(authenticated)/components/tabs/types';
import { analysis, mineral, standardValues } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { WidgetSelect } from '@/lib/types/db';
import { and, eq } from 'drizzle-orm';
import MineralLevelWidget from '../mineral-level-widget/mineral-level-widget';
import { MineralChartType } from '../mineral-level-widget/types';
import WidgetDeleteButton from './widget-delete-button';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';

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
      const user = await getAuthenticatedInfo();

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

      const [standardCalciumValues] = await db
        .select({
          calciumMin: standardValues.calciumMin,
          calciumLow: standardValues.calciumLow,
          calciumIdeal: standardValues.calciumIdeal,
          calciumHigh: standardValues.calciumHigh,
          calicumMax: standardValues.calciumMax,
        })
        .from(standardValues)
        .where(eq(standardValues.farmId, user.farmId))
        .limit(1);

      if (calciumReadings.length === 0 || !standardCalciumValues) {
        return <p>No calcium data currently available</p>;
      }

      const min = standardCalciumValues.calciumMin;
      const max = standardCalciumValues.calicumMax;

      const lastUpdated = calciumReadings.at(-1)!.createdAt;
      const chartData: MineralChartType[] = calciumReadings.map((reading) => {
        // If the real value is higher or lower than the min or the max that this chart has, respectively, just set it to the bottom but let the user know that this is the case.
        const realValue = Number(reading.realValue);
        let x = realValue;
        if (realValue > max) {
          x = max;
        } else if (realValue < min) {
          x = min;
        }

        return {
          y: 0,
          x,
          realValue,
          date: reading.createdAt,
          unit: reading.unit,
        };
      });

      return (
        <>
          <div className="flex flex-row justify-between">
            <h2>Calcium</h2>
            <p>Last Updated {lastUpdated.toLocaleDateString()}</p>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={max}
            min={min}
            chartData={chartData}
            standards={{
              low: standardCalciumValues.calciumLow,
              ideal: standardCalciumValues.calciumIdeal,
              high: standardCalciumValues.calciumHigh,
            }}
          />
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
