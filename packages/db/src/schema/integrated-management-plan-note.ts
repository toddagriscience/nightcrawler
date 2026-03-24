// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { integratedManagementPlan } from './integrated-management-plan';
import { user } from './user';

/** User-authored notes for a specific IMP. One note per IMP per user. */
export const integratedManagementPlanNote = pgTable(
  'integrated_management_plan_note',
  {
    id: serial().primaryKey().notNull(),
    integratedManagementPlanId: integer()
      .references(() => integratedManagementPlan.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    notes: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.integratedManagementPlanId, table.userId)]
);
