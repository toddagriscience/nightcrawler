// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { managementZone } from './management-zone';
import { user } from './user';

/**
 * Farm-shared notes recorded against a management zone. Every user on the
 * farm can read and change them. `userId` records who wrote the current row
 * and is not shown in the zone dashboard.
 */
export const managementZoneObservation = pgTable(
  'management_zone_observation',
  {
    id: serial().primaryKey().notNull(),
    managementZoneId: integer()
      .references(() => managementZone.id, { onDelete: 'cascade' })
      .notNull(),
    /** Author of the latest save. Cleared if that user is deleted. */
    userId: integer().references(() => user.id, { onDelete: 'set null' }),
    body: text().notNull(),
    /** Calendar day the observation was made, stored at UTC midnight. */
    observedOn: timestamp().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('management_zone_observation_zone_observed_on_idx').on(
      table.managementZoneId,
      table.observedOn
    ),
  ]
);
