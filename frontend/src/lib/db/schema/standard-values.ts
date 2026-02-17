// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';

/** Standard values for various soil parameters per farm. The majority of these values are standard across farms. Unless otherwise specified, the units for these values are all in PPM. */
export const standardValues = pgTable('standard_values', {
  /** Auto increment id */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to the farm */
  farmId: integer()
    .references(() => farm.id, { onDelete: 'set null' })
    .notNull()
    .unique(),
  /** Calcium minimum value */
  calciumMin: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Calcium low value */
  calciumLow: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Calcium ideal value */
  calciumIdeal: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Calcium high value */
  calciumHigh: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  /** Calcium maximum acceptable value */
  calciumMax: numeric({ precision: 10, scale: 2 })
    .$type<number>()
    .default(0)
    .notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
