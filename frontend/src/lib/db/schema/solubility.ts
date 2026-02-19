// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { analysis } from './analysis';

/** The solubility metric for an analysis. */
export const solubility = pgTable('solubility', {
  /** Auto increment id -- no specific format for IDs for solubility */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given analysis */
  analysisId: varchar({ length: 13 }).references(() => analysis.id, {
    onDelete: 'set null',
  }),
  /** The real value of the mineral (see the unit field for units) */
  real_value: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The ideal value of the mineral (see the unit field for units) */
  ideal_value: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The unit which this mineral is being measured in. */
  units: varchar({ length: 100 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
