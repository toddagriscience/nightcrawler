// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  createFarmDefaultSettings,
  getStandardValues,
} from '@nightcrawler/db/queries';
import { analysis, mineral } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { toMineralChartProps } from './to-mineral-chart';
import { toPhRange } from './to-ph-range';
import { ZoneActiveTemplate } from './zone-active-template';
import type { ZoneMineralChart } from './zone-mineral-charts';
import { ZoneStatusPlaceholder } from './zone-status-placeholder';

/** Months between a soil sample and the next scheduled one. */
const TEST_PERIOD_MONTHS = 6;

const ZONE_READING_MINERALS = ['Calcium', 'PH'] as const;

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Per-management-zone template. Zones without an analysis show a pending
 * placeholder. Zones with an analysis show info, Calcium/pH charts, insight,
 * observations, and search.
 *
 * @param {object} props - Component props.
 * @param {number} props.zoneId - Selected management zone id.
 * @param {string} props.zoneName - Selected management zone name.
 * @returns {Promise<React.ReactNode>} The rendered zone template.
 */
export default async function ZoneTemplate({
  zoneId,
  zoneName,
}: {
  zoneId: number;
  zoneName: string;
}) {
  const [latest] = await db
    .select({
      id: analysis.id,
      analysisDate: analysis.analysisDate,
      summary: analysis.summary,
      macroActionableInfo: analysis.macroActionableInfo,
    })
    .from(analysis)
    .where(eq(analysis.managementZone, zoneId))
    .orderBy(desc(analysis.analysisDate))
    .limit(1);

  if (!latest) {
    return <ZoneStatusPlaceholder status="pending" />;
  }

  const currentUser = await getAuthenticatedInfo();

  const [readings, initialCalciumThresholds, initialPhThresholds] =
    await Promise.all([
      db
        .select({
          name: mineral.name,
          realValue: mineral.realValue,
          units: mineral.units,
        })
        .from(mineral)
        .where(
          and(
            eq(mineral.analysisId, latest.id),
            inArray(mineral.name, [...ZONE_READING_MINERALS])
          )
        ),
      getStandardValues(currentUser.farmId, 'Calcium'),
      getStandardValues(currentUser.farmId, 'PH'),
    ]);

  let calciumThresholds = initialCalciumThresholds;
  let phThresholds = initialPhThresholds;
  if (!calciumThresholds || !phThresholds) {
    await createFarmDefaultSettings(currentUser.farmId);
    [calciumThresholds, phThresholds] = await Promise.all([
      getStandardValues(currentUser.farmId, 'Calcium'),
      getStandardValues(currentUser.farmId, 'PH'),
    ]);
  }

  const charts: ZoneMineralChart[] = [];
  const calciumReading = readings.find((row) => row.name === 'Calcium');
  if (calciumReading) {
    const props = toMineralChartProps({
      name: 'Calcium',
      realValue: Number(calciumReading.realValue),
      date: latest.analysisDate,
      storedUnit: calciumReading.units,
      thresholds: calciumThresholds,
    });
    if (props) {
      charts.push({ label: 'Calcium', props });
    }
  }

  const phReading = readings.find((row) => row.name === 'PH');
  const phRange = phReading
    ? toPhRange({
        value: Number(phReading.realValue),
        phLow: phThresholds?.low ?? null,
        phHigh: phThresholds?.high ?? null,
      })
    : null;

  const sampleDate = latest.analysisDate;
  const nextDate = addMonths(sampleDate, TEST_PERIOD_MONTHS);

  return (
    <ZoneActiveTemplate
      zoneName={zoneName}
      sampleLabel={formatDate(sampleDate)}
      nextLabel={formatDate(nextDate)}
      charts={charts}
      phRange={phRange}
      summary={latest.summary}
      action={latest.macroActionableInfo}
    />
  );
}
