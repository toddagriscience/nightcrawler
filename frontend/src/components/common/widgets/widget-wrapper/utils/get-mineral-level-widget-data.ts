// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import {
  MineralChartType,
  MineralLevelWidgetProps,
} from '../../mineral-level-widget/types';
import { db } from '@/lib/db/schema/connection';
import { analysis, mineral, mineralTypes } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { NamedTab } from '@/app/(authenticated)/components/tabs/types';
import { getStandardValues } from '@/lib/db/queries/get-standard-values';

/**
 * Fetches mineral level widget data for a given tab and mineral type.
 * Retrieves both the mineral readings and the farm's standard value thresholds.
 *
 * @param currentTab - The currently selected management zone tab
 * @param selectedMineral - The mineral type to fetch data for
 * @returns The mineral level widget props with chart data and thresholds, or null if no data exists
 */
export default async function getMineralLevelWidgetData(
  currentTab: NamedTab,
  selectedMineral: (typeof mineralTypes.enumValues)[number]
): Promise<(MineralLevelWidgetProps & { lastUpdated: Date }) | null> {
  const user = await getAuthenticatedInfo();

  const readings = await db
    .select({
      unit: mineral.units,
      realValue: mineral.realValue,
      createdAt: mineral.createdAt,
    })
    .from(analysis)
    .where(eq(analysis.managementZone, currentTab.managementZone))
    .innerJoin(
      mineral,
      and(
        eq(analysis.id, mineral.analysisId),
        eq(mineral.name, selectedMineral)
      )
    )
    .orderBy(mineral.createdAt);

  const thresholds = await getStandardValues(user.farmId, selectedMineral);

  if (readings.length === 0 || !thresholds) {
    return null;
  }

  const { min, max } = thresholds;
  const standards = {
    low: thresholds.low,
    ideal: thresholds.ideal,
    high: thresholds.high,
  };
  const lastUpdated = readings.at(-1)!.createdAt;
  const chartData: MineralChartType[] = readings.map((reading) => {
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
      unit: selectedMineral === 'PH' ? 'pH' : reading.unit,
    };
  });

  return { lastUpdated, max, min, chartData, standards };
}
