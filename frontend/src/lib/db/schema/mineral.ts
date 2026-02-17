// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  boolean,
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
  realValue: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The ideal value of the mineral (see the unit field for units) */
  idealValue: numeric({ precision: 9, scale: 4 }).notNull(),
  /** A general tag (is this value low, high, etc.) */
  tag: levelCategory(),
  /** This field set to true refers to a severe soil quality issue. Specifically, it refers to a state where the soil is "inactive" (refer to Vincent for more details). The trigger for this field being true is all 4 of the generic minerals (calcium, magnesium, sodium, and potassium) being low at the same time.*/
  fourLows: boolean().notNull(),
  /** The unit which this mineral is being measured in. */
  units: varchar({ length: 100 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
