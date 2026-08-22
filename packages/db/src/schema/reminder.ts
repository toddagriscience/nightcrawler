// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { user } from './user';

/** Reminder categories surfaced to users, including agronomic event types. */
export const reminderTypeEnum = pgEnum('reminder_type', [
  'system',
  'deadline',
  'alert',
  'planting',
  'soil sample',
  'harvest',
  'other',
]);

/** User reminders surfaced in the Reminders page, with optional seasonal dates. */
export const reminder = pgTable('reminder', {
  id: serial().primaryKey().notNull(),
  userId: integer()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  type: reminderTypeEnum('type').notNull(),
  title: varchar({ length: 255 }).notNull(),
  body: varchar({ length: 1000 }).notNull(),
  read: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  /** Optional deep-link URL */
  href: varchar({ length: 500 }),
  /** Optional exact due date */
  dueDate: timestamp(),
  /** Optional seasonal label like "mid March" or "early spring" */
  seasonalLabel: varchar({ length: 100 }),
});
