// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  serial,
  varchar,
  timestamp,
  boolean,
  pgTable,
} from 'drizzle-orm/pg-core';

/**
 * An internal account used by advisors and C-level executives
 * to access the internal dashboard.
 */
export const internalAccount = pgTable('internal_account', {
  /** Auto increment id */
  id: serial().primaryKey(),
  /** First name of the internal user */
  firstName: varchar({ length: 200 }).notNull(),
  /** Last name of the internal user */
  lastName: varchar({ length: 200 }).notNull(),
  /** Email address, must match a Supabase auth account */
  email: varchar({ length: 320 }).notNull().unique(),
  /** Job title or role description */
  title: varchar({ length: 200 }),
  /** Whether this account is currently active */
  isActive: boolean().default(true).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
