// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@/lib/db/schema/connection';
import { mineralTypes, standardValues } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { type AnyPgColumn } from 'drizzle-orm/pg-core';

/**
 * All data types available in the standard_values table.
 * Each type corresponds to 5 columns: {type}Min, {type}Low, {type}Ideal, {type}High, {type}Max.
 */
export type StandardValueType =
  | 'calcium'
  | 'ph'
  | 'salts'
  | 'magnesium'
  | 'exchangeableSodiumPercentage'
  | 'nitrateNitrogen'
  | 'phosphatePhosphorus'
  | 'potassium'
  | 'zinc'
  | 'iron'
  | 'organicMatter';

/** Normalized standard value thresholds for a single data type */
export interface StandardValueThresholds {
  min: number;
  low: number;
  ideal: number;
  high: number;
  max: number;
}

/** Maps mineral type enum values to their corresponding standard_values column prefix */
const mineralToStandardValueType: Record<
  (typeof mineralTypes.enumValues)[number],
  StandardValueType
> = {
  Calcium: 'calcium',
  Magnesium: 'magnesium',
  Sodium: 'exchangeableSodiumPercentage',
  Potassium: 'potassium',
  PH: 'ph',
  Salinity: 'salts',
  NitrateNitrogen: 'nitrateNitrogen',
  PhosphatePhosphorus: 'phosphatePhosphorus',
  Zinc: 'zinc',
  Iron: 'iron',
  OrganicMatter: 'organicMatter',
};

/**
 * Retrieves the standard value thresholds (min, low, ideal, high, max)
 * for a given data type and farm. Only the 5 relevant columns are selected.
 *
 * @param farmId - The farm to look up standard values for
 * @param type - The data type (e.g. 'calcium', 'potassium', 'ph')
 * @returns The normalized thresholds, or null if no standard values exist for the farm
 */
export async function getStandardValues(
  farmId: number,
  type: (typeof mineralTypes.enumValues)[number]
): Promise<StandardValueThresholds | null> {
  const mappedType = mineralToStandardValueType[type];

  // Dynamic column lookup — AnyPgColumn erases the per-column name brand
  // so Drizzle's .select() accepts columns from different mineral types uniformly.
  const col = (suffix: string): AnyPgColumn =>
    standardValues[
      `${mappedType}${suffix}` as keyof typeof standardValues
    ] as AnyPgColumn;

  const [result] = await db
    .select({
      min: col('Min'),
      low: col('Low'),
      ideal: col('Ideal'),
      high: col('High'),
      max: col('Max'),
    })
    .from(standardValues)
    .where(eq(standardValues.farmId, farmId))
    .limit(1);

  return (result as unknown as StandardValueThresholds) ?? null;
}
