// Copyright © Todd Agriscience, Inc. All rights reserved.

import { numeric, pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { analysis } from './analysis.js';

/** A general tag for the oxidation rate of a given analysis. */
export const oxidationRateTag = pgEnum('oxidation_rate_tag', [
  'Slow',
  'Mixed',
  'Ideal',
  'High',
]);

/** The oxidation rate for a given analysis. */
export const oxidationRate = pgTable('oxidation_rate', {
  /** Auto increment id -- no specific format for IDs for oxidation rate */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given analysis */
  analysisId: varchar({ length: 13 }).references(() => analysis.id),
  /** The measured calcium to potassium ratio (read as Ca/K) */
  real_caK: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The ideal calcium to potassium ratio (read as Ca/K) */
  ideal_caK: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The measured sodium to magnesium ratio (read as Na/Mg)*/
  real_NaMg: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The ideal sodium to magnesium ratio (read as Na/Mg)*/
  ideal_NaMg: numeric({ precision: 9, scale: 4 }).notNull(),
  /** A general tag for the oxidation rate. See the enum for more info. */
  tag: oxidationRateTag(),
  /** The unit which this mineral is being measured in. */
  units: varchar({ length: 100 }).notNull(),
});
