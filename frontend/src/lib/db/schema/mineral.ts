// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { analysis } from './analysis';
import { levelCategory } from './level-category';

/** A table that describes a single mineral and its values for a given analysis. */
export const mineral = pgTable('mineral', {
  /** Auto increment id -- no specific format for IDs for minerals */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given analysis */
  analysisId: varchar({ length: 13 })
    .references(() => analysis.id)
    .notNull(),
  /** The name of the mineral in reference. */
  name: varchar({ length: 200 }).notNull(),
  /** The real value of the mineral (see the unit field for units) */
  real_value: numeric({ precision: 9, scale: 4 }).notNull(),
  /** The ideal value of the mineral (see the unit field for units) */
  ideal_value: numeric({ precision: 9, scale: 4 }).notNull(),
  /** A general tag (is this value low, high, etc.) */
  tag: levelCategory(),
  /** This field set to true refers to a severe soil quality issue. Specifically, it refers to a state where the soil is "inactive" (refer to Vincent for more details). The trigger for this field being true is all 4 of the generic minerals (calcium, magnesium, sodium, and potassium) being low at the same time.*/
  four_lows: boolean().notNull(),
  /** The unit which this mineral is being measured in. */
  units: varchar({ length: 100 }).notNull(),
});
