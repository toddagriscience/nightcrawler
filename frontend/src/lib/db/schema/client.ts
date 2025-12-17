// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  date,
  pgEnum,
  pgTable,
  point,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

/** The "top" table. A given client's core information. "Client" may refer to the owner of a given business involved with Todd Agriscience or a representative. */
export const client = pgTable('client', {
  /** Auto increment id */
  id: serial().primaryKey().notNull(),
  /** Name of the business */
  businessName: varchar({ length: 200 }).notNull(),
  /** Client's first name */
  firstName: varchar({ length: 200 }).notNull(),
  /** Client's last name */
  lastName: varchar({ length: 200 }).notNull(),
  /** Client's email/business' main email */
  email: varchar({ length: 200 }).notNull(),
  /** Phone number in E164 format */
  phone: varchar({ length: 15 }).notNull(),
});

/** Client location data. This table *should* be internationally compatible, and all fields that aren't documented should be completely self explanatory. */
export const clientLocation = pgTable('client_location', {
  /** Foreign key relationship back to the client */
  clientId: varchar({ length: 13 })
    .references(() => client.id)
    .notNull()
    .primaryKey(),
  /** The literal longitude/latitude position of the client. The exact location from where these coordinates were taken *does not matter.* */
  farmLocation: point({ mode: 'tuple' }),
  address1: varchar({ length: 200 }).notNull(),
  address2: varchar({ length: 200 }),
  address3: varchar({ length: 200 }),
  postalCode: varchar({ length: 20 }).notNull(),
  state: varchar({ length: 100 }).notNull(),
  country: varchar({ length: 200 }).notNull(),
});

/** Some farms have certain certificates that require them to act and/or behave in a certain manner, and in some scenarios, Todd has to adjust their practices to accomdate these requirements. These certificates may be abbreviated as NOP, DEM, GAP, and LFI respectively. */
export const certificateType = pgEnum('certificate_type', [
  'National Organic Program',
  'Demeter',
  'Good Agriculture Practices',
  'Local/Facility Inspection',
]);

/** Any certificates that the client's business/farm has. See the certificateType enum for more info. */
export const clientCertificate = pgTable('client_certificate', {
  /** Auto increment id -- no specific format for IDs for client certificates */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to the client */
  clientId: varchar({ length: 13 })
    .references(() => client.id)
    .notNull()
    .primaryKey(),
  /** The kind of certificate. See the certificateType enum for more info. */
  kind: certificateType().notNull(),
  /** The date this certificate was granted/initialized */
  date: date({ mode: 'date' }).notNull(),
  /** The date this certificate expires */
  expDate: date({ mode: 'date' }).notNull(),
});
