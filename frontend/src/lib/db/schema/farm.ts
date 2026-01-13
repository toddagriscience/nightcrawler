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
export const farm = pgTable('farm', {
  /** Auto increment id */
  id: serial().primaryKey().notNull(),
  /** Informal/non-legal name of the farm. Collected during Inbound Onboarding */
  informalName: varchar({ length: 200 }),
  /** Legal name of the farm. Collected during Internal Onboarding */
  businessName: varchar({ length: 200 }),
  /** The website of the farm */
  businessWebsite: varchar({ length: 200 }),
  /** The date the farm was founded. Collected during Internal Onboarding */
  founded: date('founded'),
});

/** Client location data. This table *should* be internationally compatible, and all fields that aren't documented should be completely self explanatory. */
export const farmLocation = pgTable('farmLocation', {
  /** Foreign key relationship back to the client */
  farmId: varchar({ length: 13 })
    .references(() => farm.id, { onDelete: 'cascade' })
    .notNull()
    .primaryKey(),
  /** The literal longitude/latitude position of the client. The exact location from where these coordinates were taken *does not matter.* */
  location: point({ mode: 'tuple' }),
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
export const farmCertificate = pgTable('farm_certificate', {
  /** Auto increment id -- no specific format for IDs for client certificates */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to the client */
  farmId: varchar({ length: 13 })
    .references(() => farm.id, { onDelete: 'cascade' })
    .notNull(),
  /** The kind of certificate. See the certificateType enum for more info. */
  kind: certificateType().notNull(),
  /** The date this certificate was granted/initialized */
  date: date({ mode: 'date' }).notNull(),
  /** The date this certificate expires */
  expDate: date({ mode: 'date' }).notNull(),
});
