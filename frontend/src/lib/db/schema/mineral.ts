// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { analysis } from './analysis';

export const mineralTypes = pgEnum('mineral_types', [
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
]);

export const units = pgEnum('units', ['ppm', '%']);

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
  /** The unit which this mineral is being measured in. Almost always PPM */
  units: units().notNull(),
  /** Actionable information or recommendation associated with this mineral reading. */
  actionableInfo: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
