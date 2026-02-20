// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NamedTab } from '@/app/(authenticated)/components/tabs/types';
import { analysis, mineral, standardValues } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { WidgetSelect } from '@/lib/types/db';
import { desc, eq } from 'drizzle-orm';
import MineralLevelWidget from '../mineral-level-widget/mineral-level-widget';
import { MacroRadarWidget, normalizeMacroValue } from '../macro-radar-widget';
import { MacroRadarDataPoint } from '../macro-radar-widget/types';
import WidgetDeleteButton from './widget-delete-button';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import getMineralLevelWidgetData from './utils/get-mineral-level-widget-data';

/** This is a somewhat clunky component that renders a given widget. Will be refactored when we're done building this godforsaken MVP.
 *
 * When adding a widget, you need to:
 * 1. Add an entry in the `widgets` enum.
 * 2. Add an entry in `widgetSizing` in `widgets/sizing.ts`
 * 3. Add your widget here */
export default async function WidgetWrapper({
  widget,
  currentTab,
}: {
  widget: WidgetSelect;
  currentTab: NamedTab;
}) {
  switch (widget.name) {
    case 'Macro Radar':
      const radarUser = await getAuthenticatedInfo();

      // Fetch standard values for the current user's farm
      const [macroStandards] = await db
        .select({
          calciumLow: standardValues.calciumLow,
          calciumIdeal: standardValues.calciumIdeal,
          calciumMax: standardValues.calciumMax,
          magnesiumLow: standardValues.magnesiumLow,
          magnesiumIdeal: standardValues.magnesiumIdeal,
          magnesiumMax: standardValues.magnesiumMax,
          sodiumLow: standardValues.exchangeableSodiumPercentageLow,
          sodiumIdeal: standardValues.exchangeableSodiumPercentageIdeal,
          sodiumMax: standardValues.exchangeableSodiumPercentageMax,
          potassiumLow: standardValues.potassiumLow,
          potassiumIdeal: standardValues.potassiumIdeal,
          potassiumMax: standardValues.potassiumMax,
        })
        .from(standardValues)
        .where(eq(standardValues.farmId, radarUser.farmId))
        .limit(1);

      if (!macroStandards) {
        return <p>No standard values configured</p>;
      }

      // Fetch the most recent reading for each mineral in this management zone
      const latestReadings = await db
        .select({
          name: mineral.name,
          realValue: mineral.realValue,
          units: mineral.units,
          createdAt: mineral.createdAt,
        })
        .from(analysis)
        .where(eq(analysis.managementZone, currentTab.managementZone))
        .innerJoin(mineral, eq(analysis.id, mineral.analysisId))
        .orderBy(desc(mineral.createdAt));

      // Pick the most recent reading per mineral type and overall last updated date
      const latestByMineral = new Map<
        string,
        { value: number; unit: string }
      >();
      let radarLastUpdated: Date | null = null;
      for (const reading of latestReadings) {
        if (!latestByMineral.has(reading.name)) {
          latestByMineral.set(reading.name, {
            value: Number(reading.realValue),
            unit: reading.units,
          });
        }
        if (!radarLastUpdated || reading.createdAt > radarLastUpdated) {
          radarLastUpdated = reading.createdAt;
        }
      }

      const macros: {
        name: string;
        rawValue: number | null;
        unit: string;
        range: { low: number; ideal: number; max: number };
      }[] = [
        {
          name: 'Calcium',
          rawValue: latestByMineral.get('Calcium')?.value ?? null,
          unit: latestByMineral.get('Calcium')?.unit ?? 'ppm',
          range: {
            low: Number(macroStandards.calciumLow),
            ideal: Number(macroStandards.calciumIdeal),
            max: Number(macroStandards.calciumMax),
          },
        },
        {
          name: 'Magnesium',
          rawValue: latestByMineral.get('Magnesium')?.value ?? null,
          unit: latestByMineral.get('Magnesium')?.unit ?? 'ppm',
          range: {
            low: Number(macroStandards.magnesiumLow),
            ideal: Number(macroStandards.magnesiumIdeal),
            max: Number(macroStandards.magnesiumMax),
          },
        },
        {
          name: 'Sodium',
          rawValue: latestByMineral.get('Sodium')?.value ?? null,
          unit: latestByMineral.get('Sodium')?.unit ?? '%',
          range: {
            low: Number(macroStandards.sodiumLow),
            ideal: Number(macroStandards.sodiumIdeal),
            max: Number(macroStandards.sodiumMax),
          },
        },
        {
          name: 'Potassium',
          rawValue: latestByMineral.get('Potassium')?.value ?? null,
          unit: latestByMineral.get('Potassium')?.unit ?? 'ppm',
          range: {
            low: Number(macroStandards.potassiumLow),
            ideal: Number(macroStandards.potassiumIdeal),
            max: Number(macroStandards.potassiumMax),
          },
        },
      ];

      const radarData: MacroRadarDataPoint[] = macros.map((m) => ({
        macro: m.name,
        rawValue: m.rawValue,
        unit: m.unit,
        normalized:
          m.rawValue !== null
            ? Math.round(normalizeMacroValue(m.rawValue, m.range))
            : 0,
      }));

      return (
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Macro Radar</h2>
              {radarLastUpdated && (
                <p className="text-sm font-light">
                  Last Updated {radarLastUpdated.toLocaleDateString()}
                </p>
              )}
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>
          <div className="min-h-0 flex-1">
            <MacroRadarWidget data={radarData} />
          </div>
        </div>
      );

    case 'Calcium Widget':
      const mineralLevelWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'Calcium'
      );

      if (!mineralLevelWidgetData) {
        return <p>No calcium data currently available</p>;
      }

      const { max, min, lastUpdated, chartData, standards } =
        mineralLevelWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Calcium</h2>
              <p className="text-sm font-light">
                Last Updated {lastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={max}
            min={min}
            chartData={chartData}
            standards={standards}
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
