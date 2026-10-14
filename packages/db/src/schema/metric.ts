// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { analysis } from './analysis';

/** Supported analysis metrics, including pH and organic matter; retains the existing enum type. */
export const metricTypes = pgEnum('mineral_types', [
  'Calcium',
  'Magnesium',
  'Sodium',
  'Potassium',
  'PH',
  'Salinity',
  'NitrateNitrogen',
  'PhosphatePhosphorus',
  'Zinc',
  'Iron',
  'OrganicMatter',
  'Manganese',
  'Copper',
  'Boron',
]);

/** Existing measurement units used by analysis metrics. */
export const units = pgEnum('units', ['ppm', '%', 'dimensionless']);

/** Tag indicating whether a mineral reading is Low, Med (optimal), or High. */
export const metricTag = pgEnum('mineral_tag', ['Low', 'Med', 'High']);

/** An analysis measurement, including nutrients and non-mineral soil properties. */
export const metric = pgTable('metric', {
  /** Stable reading id; existing records retain their ids during the table cutover. */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given analysis */
  analysisId: varchar({ length: 13 }).references(() => analysis.id, {
    onDelete: 'set null',
  }),
  /** The measured soil property. */
  name: metricTypes().notNull(),
  /** The observed value of the metric (see the unit field for units) */
  realValue: numeric({ precision: 9, scale: 4 }).notNull().$type<number>(),
  /** The ideal value from Vincent's Data Framework (same units as realValue) */
  idealValue: numeric({ precision: 9, scale: 4 }).$type<number>(),
  /** The measurement unit, including dimensionless pH. */
  units: units().notNull(),
  /** Low / Med / High tag based on lab reference ranges */
  tag: metricTag(),
  /** True when Ca, Mg, Na, and K are all simultaneously below Four Lows thresholds */
  fourLows: boolean(),
  /** Actionable information or recommendation associated with this metric reading. */
  actionableInfo: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
