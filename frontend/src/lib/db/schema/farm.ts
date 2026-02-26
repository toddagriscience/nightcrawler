// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  date,
  pgEnum,
  pgTable,
  point,
  serial,
  timestamp,
  varchar,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

/** The "top" table. A given client's core information. "Client" may refer to the owner of a given business involved with Todd Agriscience or a representative. */
export const farm = pgTable('farm', {
  /** Auto increment id */
  id: serial().primaryKey().notNull(),
  /** Informal/non-legal name of the farm. Collected during Inbound Onboarding */
  informalName: varchar({ length: 200 }),
  /** Legal name of the farm. Collected during Internal Onboarding */
  businessName: varchar({ length: 200 }),
  /** The website of the farm */
  businessWebsite: varchar({ length: 200 }),
  /** The date the farm started. Collected during Internal Onboarding */
  managementStartDate: date(),
  /** Is this farm approved? If it is, assume that billing is active. This is handled manually at the moment. */
  approved: boolean('approved').default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Client location data. This table *should* be internationally compatible, and all fields that aren't documented should be completely self explanatory. */
export const farmLocation = pgTable('farm_location', {
  /** Foreign key relationship back to the farm */
  farmId: integer()
    .references(() => farm.id, { onDelete: 'set default' })
    .primaryKey()
    .default(2147483647),
  /** The literal longitude/latitude position of the client. The exact location from where these coordinates were taken *does not matter.* */
  location: point({ mode: 'tuple' }),
  /** County Assessor's parcel number (APN) - required if no physical address */
  apn: varchar({ length: 100 }),
  /** County, State - required if no physical address */
  countyState: varchar({ length: 200 }),
  address1: varchar({ length: 200 }),
  address2: varchar({ length: 200 }),
  address3: varchar({ length: 200 }),
  postalCode: varchar({ length: 20 }),
  state: varchar({ length: 100 }),
  country: varchar({ length: 200 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Any certificates that the client's business/farm has. See the certificateType enum for more info. */
export const farmCertificate = pgTable('farm_certificate', {
  /** Auto increment id -- no specific format for IDs for client certificates */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to the farm */
  farmId: integer()
    .references(() => farm.id, {
      onDelete: 'set default',
    })
    .notNull()
    .default(2147483647),
  hasGAP: boolean().default(false),
  GAPDate: date(),
  hasLocalInspection: boolean().default(false),
  localInspectionDate: date(),
  hasOrganic: boolean().default(false),
  organicDate: date(),
  hasBiodynamic: boolean().default(false),
  biodynamicDate: date(),
  hasRegenerativeOrganic: boolean().default(false),
  regenerativeOrganic: date(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
