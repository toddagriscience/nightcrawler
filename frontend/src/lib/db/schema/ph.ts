// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { analysis } from './analysis';

/** The ph data for a given analysis. */
export const ph = pgTable('ph', {
  /** Auto increment id -- no specific format for IDs for oxidation rate */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given analysis */
  analysisId: varchar({ length: 13 }).references(() => analysis.id, {
    onDelete: 'set null',
  }),
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
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
