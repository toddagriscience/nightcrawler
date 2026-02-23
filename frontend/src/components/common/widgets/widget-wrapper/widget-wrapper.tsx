// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NamedTab } from '@/app/(authenticated)/components/tabs/types';
import {
  analysis,
  integratedManagementPlan,
  mineral,
  standardValues,
} from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { WidgetSelect } from '@/lib/types/db';
import { desc, eq } from 'drizzle-orm';
import MineralLevelWidget from '../mineral-level-widget/mineral-level-widget';
import { MacroRadarWidget, normalizeMacroValue } from '../macro-radar-widget';
import { MacroRadarDataPoint } from '../macro-radar-widget/types';
import WidgetDeleteButton from './components/widget-delete-button';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import getMineralLevelWidgetData from './utils/get-mineral-level-widget-data';
import MineralDataNotFound from './components/mineral-data-not-found';
import EditableSummary from '@/app/(authenticated)/components/tabs/current-tab/summary-sidebar/editable-summary';

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
          <p className="mt-1 mb-2 text-xs font-light text-muted-foreground">
            Macro nutrient levels relative to your ideal ranges. 50% = low
            boundary, 100% = ideal midpoint, 150% = upper limit.
          </p>
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
        return <MineralDataNotFound name="calcium" widget={widget} />;
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

    case 'PH Widget':
      const phWidgetData = await getMineralLevelWidgetData(currentTab, 'PH');

      if (!phWidgetData) {
        return <MineralDataNotFound name="pH" widget={widget} />;
      }

      const {
        max: phMax,
        min: phMin,
        lastUpdated: phLastUpdated,
        chartData: phChartData,
        standards: phStandards,
      } = phWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>pH</h2>
              <p className="text-sm font-light">
                Last Updated {phLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={phMax}
            min={phMin}
            chartData={phChartData}
            standards={phStandards}
          />
        </>
      );

    case 'Salinity Widget':
      const salinityWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'Salinity'
      );

      if (!salinityWidgetData) {
        return <MineralDataNotFound name="salinity" widget={widget} />;
      }

      const {
        max: salinityMax,
        min: salinityMin,
        lastUpdated: salinityLastUpdated,
        chartData: salinityChartData,
        standards: salinityStandards,
      } = salinityWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Salinity</h2>
              <p className="text-sm font-light">
                Last Updated {salinityLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={salinityMax}
            min={salinityMin}
            chartData={salinityChartData}
            standards={salinityStandards}
          />
        </>
      );

    case 'Magnesium Widget':
      const magnesiumWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'Magnesium'
      );

      if (!magnesiumWidgetData) {
        return <MineralDataNotFound name="magnesium" widget={widget} />;
      }

      const {
        max: magnesiumMax,
        min: magnesiumMin,
        lastUpdated: magnesiumLastUpdated,
        chartData: magnesiumChartData,
        standards: magnesiumStandards,
      } = magnesiumWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Magnesium</h2>
              <p className="text-sm font-light">
                Last Updated {magnesiumLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={magnesiumMax}
            min={magnesiumMin}
            chartData={magnesiumChartData}
            standards={magnesiumStandards}
          />
        </>
      );

    case 'Sodium Widget':
      const sodiumWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'Sodium'
      );

      if (!sodiumWidgetData) {
        return <MineralDataNotFound name="sodium" widget={widget} />;
      }

      const {
        max: sodiumMax,
        min: sodiumMin,
        lastUpdated: sodiumLastUpdated,
        chartData: sodiumChartData,
        standards: sodiumStandards,
      } = sodiumWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Sodium</h2>
              <p className="text-sm font-light">
                Last Updated {sodiumLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={sodiumMax}
            min={sodiumMin}
            chartData={sodiumChartData}
            standards={sodiumStandards}
          />
        </>
      );

    case 'Nitrate Nitrogen Widget':
      const nitrateWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'NitrateNitrogen'
      );

      if (!nitrateWidgetData) {
        return <MineralDataNotFound name="NO3-N" widget={widget} />;
      }

      const {
        max: nitrateMax,
        min: nitrateMin,
        lastUpdated: nitrateLastUpdated,
        chartData: nitrateChartData,
        standards: nitrateStandards,
      } = nitrateWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>NO3-N</h2>
              <p className="text-sm font-light">
                Last Updated {nitrateLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={nitrateMax}
            min={nitrateMin}
            chartData={nitrateChartData}
            standards={nitrateStandards}
          />
        </>
      );

    case 'Phosphate Phosphorus Widget':
      const phosphateWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'PhosphatePhosphorus'
      );

      if (!phosphateWidgetData) {
        return <MineralDataNotFound name="PO4-P" widget={widget} />;
      }

      const {
        max: phosphateMax,
        min: phosphateMin,
        lastUpdated: phosphateLastUpdated,
        chartData: phosphateChartData,
        standards: phosphateStandards,
      } = phosphateWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>PO4-P</h2>
              <p className="text-sm font-light">
                Last Updated {phosphateLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={phosphateMax}
            min={phosphateMin}
            chartData={phosphateChartData}
            standards={phosphateStandards}
          />
        </>
      );

    case 'Potassium Widget':
      const potassiumWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'Potassium'
      );

      if (!potassiumWidgetData) {
        return <MineralDataNotFound name="potassium" widget={widget} />;
      }

      const {
        max: potassiumMax,
        min: potassiumMin,
        lastUpdated: potassiumLastUpdated,
        chartData: potassiumChartData,
        standards: potassiumStandards,
      } = potassiumWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Potassium</h2>
              <p className="text-sm font-light">
                Last Updated {potassiumLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={potassiumMax}
            min={potassiumMin}
            chartData={potassiumChartData}
            standards={potassiumStandards}
          />
        </>
      );

    case 'Zinc Widget':
      const zincWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'Zinc'
      );

      if (!zincWidgetData) {
        return <MineralDataNotFound name="zinc" widget={widget} />;
      }

      const {
        max: zincMax,
        min: zincMin,
        lastUpdated: zincLastUpdated,
        chartData: zincChartData,
        standards: zincStandards,
      } = zincWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Zinc</h2>
              <p className="text-sm font-light">
                Last Updated {zincLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={zincMax}
            min={zincMin}
            chartData={zincChartData}
            standards={zincStandards}
          />
        </>
      );

    case 'Iron Widget':
      const ironWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'Iron'
      );

      if (!ironWidgetData) {
        return <MineralDataNotFound name="iron" widget={widget} />;
      }

      const {
        max: ironMax,
        min: ironMin,
        lastUpdated: ironLastUpdated,
        chartData: ironChartData,
        standards: ironStandards,
      } = ironWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Iron</h2>
              <p className="text-sm font-light">
                Last Updated {ironLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={ironMax}
            min={ironMin}
            chartData={ironChartData}
            standards={ironStandards}
          />
        </>
      );

    case 'Organic Matter Widget':
      const organicMatterWidgetData = await getMineralLevelWidgetData(
        currentTab,
        'OrganicMatter'
      );

      if (!organicMatterWidgetData) {
        return <MineralDataNotFound name="organic matter" widget={widget} />;
      }

      const {
        max: organicMatterMax,
        min: organicMatterMin,
        lastUpdated: organicMatterLastUpdated,
        chartData: organicMatterChartData,
        standards: organicMatterStandards,
      } = organicMatterWidgetData;

      return (
        <>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-5">
              <h2>Organic Matter</h2>
              <p className="text-sm font-light">
                Last Updated {organicMatterLastUpdated.toLocaleDateString()}
              </p>
            </div>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>

          <MineralLevelWidget
            max={organicMatterMax}
            min={organicMatterMin}
            chartData={organicMatterChartData}
            standards={organicMatterStandards}
          />
        </>
      );

    case 'IMP Summaries':
      const imps = await db
        .select()
        .from(integratedManagementPlan)
        .where(
          eq(integratedManagementPlan.managementZone, currentTab.managementZone)
        )
        .orderBy(desc(integratedManagementPlan.createdAt))
        .limit(10);

      return (
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex flex-row items-center justify-between">
            <h2>IMP Summaries</h2>
            <WidgetDeleteButton widgetId={widget.id} />
          </div>
          <div className="mt-2 min-h-0 flex-1 space-y-3 overflow-y-auto">
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
