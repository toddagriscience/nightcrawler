// Copyright © Todd Agriscience, Inc. All rights reserved.

import { numeric, pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { analysis } from './analysis';

/** A general tag for solubility. See the mineral table for more context. */
export const solubilityLevel = pgEnum('solubility_level', [
  'Low',
  'Med',
  'High',
]);

/** The solubility metric for an analysis. */
export const solubility = pgTable('solubility', {
  /** Auto increment id -- no specific format for IDs for solubility */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given analysis */
  analysisId: varchar({ length: 13 })
    .references(() => analysis.id)
    .notNull(),
  /** The real value of the mineral (see the unit field for units) */
  real_value: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The ideal value of the mineral (see the unit field for units) */
  ideal_value: numeric({ precision: 9, scale: 4 }).notNull(),
  /** A general tag (is this value low, high, etc.) */
  tag: solubilityLevel(),
  /** The unit which this mineral is being measured in. */
  units: varchar({ length: 100 }).notNull(),
});
