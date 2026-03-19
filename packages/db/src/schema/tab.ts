// Copyright © Todd Agriscience, Inc. All rights reserved.

import { integer, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { user } from './user';
import { managementZone } from './management-zone';

/** A tab on the platform  */
export const tab = pgTable(
  'tab',
  {
    id: serial().primaryKey().notNull(),
    user: integer()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    managementZone: integer()
      .references(() => managementZone.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (t) => [unique().on(t.managementZone, t.user)]
);
