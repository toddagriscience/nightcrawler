// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  numeric,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { analysis } from './analysis';
import { levelCategory } from './level-category';

export const mineralTypes = pgEnum('mineral_types', ['Calcium']);

export const units = pgEnum('units', ['ppm']);

/** A table that describes a single mineral and its values for a given analysis. */
export const mineral = pgTable('mineral', {
  /** Auto increment id -- no specific format for IDs for minerals */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given analysis */
  analysisId: varchar({ length: 13 }).references(() => analysis.id, {
    onDelete: 'set null',
  }),
  /** The name of the mineral in reference. */
  name: mineralTypes().notNull(),
  /** The real value of the mineral (see the unit field for units) */
  realValue: numeric({ precision: 9, scale: 4 }).notNull().$type<number>(),
  /** A general tag (is this value low, high, etc.) */
  tag: levelCategory(),
  /** The unit which this mineral is being measured in. Almost always PPM */
  units: units().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
