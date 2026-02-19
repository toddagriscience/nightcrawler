// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  date,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { analysis } from './analysis';
import { managementZone } from './management-zone';

/** Informally referred to as an IMP, an integrated management plan specifies how Todd recommends a field be handled based off of a given analysis. There are no specific fields for recommendations -- just a "plan" field. */
export const integratedManagementPlan = pgTable('integrated_management_plan', {
  /** Auto increment id -- no specific format for IDs for IMPs */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given management zone */
  managementZone: serial().references(() => managementZone.id, {
    onDelete: 'set null',
  }),
  /** Foreign key relationship to the given analysis */
  analysis: varchar({ length: 13 }).references(() => analysis.id, {
    onDelete: 'set null',
  }),
  /** Written plan for management zone */
  plan: text(),
  /** A brief summary of the integrated management plan */
  summary: text(),
  /** The date this plan was written */
  createdAt: date({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
