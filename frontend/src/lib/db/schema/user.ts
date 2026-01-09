// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  pgTable,
  serial,
  integer,
  boolean,
  varchar,
  timestamp,
  cidr,
} from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { farm } from './farm';

/** An admin can view, edit, modify, etc. anything about the farm. A viewer can only view data on the platform. */
export const userRoleEnum = pgEnum('user_role', ['Admin', 'Viewer']);

/** A user of the platform. Multiple users can access a single farm, but not all of them have the same permissions. See `userRole.ts` and the `role` column in this model. */
export const user = pgTable('user', {
  id: serial().primaryKey(),
  farmId: integer().references(() => farm.id),
  firstName: varchar({ length: 200 }).notNull(),
  lastName: varchar({ length: 200 }).notNull(),
  email: varchar({ length: 200 }).notNull(),
  /** Phone number in E164 format */
  phone: varchar({ length: 15 }),
  /** Is this user approved? If they are, assume that the user is currently being billed. This is handled manually at the moment. */
  approved: boolean('approved').default(false),
  /** The role of this user on the farm. Collected during the Internal Application */
  job: varchar({ length: 200 }),
  /** The internal role of the user. */
  role: userRoleEnum('role').notNull(),
});

/** THIS SHOULD NEVER BE MODIFIED AFTER IT IS CREATED! A "copy" of the digital acceptance of the Terms and Conditions from Todd. */
export const userTacAcceptance = pgTable('user_tac_acceptance', {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => user.id),
  /** The time this was accepted, down to the second. */
  timeAccepted: timestamp('time_accepted').notNull(),
  /** Possibly redundant field, exists for extra legal security. */
  accepted: boolean().notNull().default(false),
  /** The IP address of the user that accepted the agreement. Keep in mind that this is still tied to a row in the `user` table -- i.e. the IP address is NOT the sole bit of proof that a certain user accepted the TAC.*/
  ipAddress: cidr().notNull(),
  /** The version of the TAC accepted. */
  version: varchar({ length: 200 }).notNull(),
});
