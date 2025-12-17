// Copyright © Todd Agriscience, Inc. All rights reserved.

import { numeric, pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { analysis } from './analysis.js';

/** A general tag for the ph of a given analysis */
export const phTag = pgEnum('ph_tag', ['Low', 'Med', 'High']);

/** The ph data for a given analysis. */
export const ph = pgTable('ph', {
  /** Auto increment id -- no specific format for IDs for oxidation rate */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given analysis */
  analysisId: varchar({ length: 13 })
    .references(() => analysis.id)
    .notNull(),
  /** The real ph value */
  realValue: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The ideal upper value (ex. the ph value should be between idealValueLower and idealValueUpper) */
  idealValueLower: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The ideal lower value (ex. the ph value should be between idealValueLower and idealValueUpper) */
  idealValueUpper: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The value that, if the real ph value is lower than, warrants a tag of "low" */
  low: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The value that, if the real ph value is greater than, warrants a tag of "high" */
  high: numeric({ precision: 9, scale: 4 }).notNull(),
  /** A general tag for the results of a ph analysis */
  tag: phTag(),
});
