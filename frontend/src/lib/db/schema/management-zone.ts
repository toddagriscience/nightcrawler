// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  date,
  pgEnum,
  pgTable,
  point,
  serial,
  timestamp,
  varchar,
  boolean,
  text,
  integer,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';
import { levelCategory } from './level-category';

/** A management zone. For the majority of the time, you may think of this as a field. */
export const managementZone = pgTable('management_zone', {
  /** Auto increment id -- no specific format for IDs for management zones */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to the farm */
  farmId: integer().references(() => farm.id, {
    onDelete: 'set null',
  }),
  /** The location of the management zone (longitude, latitude). The exact location where this was measured from *does not matter*. It is only used for audits, since most management zones don't have an address. */
  location: point({ mode: 'tuple' }),
  /** The formal name of a given management zone */
  name: varchar({ length: 200 }),
  /** The date when a crops are intended to switch (ex. lettuce in the summer, carrots in the winter) */
  rotationYear: date({ mode: 'date' }),
  /** NPK is a synthetic fertilizer made from inorganic Nitrogen, Phosphorus and K potassium. It's very damaging to soil and environmental health. This field represents if NPK has been used within a certain period of time (see npk_last_used). */
  npk: boolean(),
  /** The last date that NPK had been used on a field. See the npk field for more information. */
  npkLastUsed: date({ mode: 'date' }),
  /** Does this management zone have access to water? */
  irrigation: boolean(),
  /** Some areas have aqueducts that feed to fields -- if this is false, the farm is either receiving plenty of water or has enough runoff to feed back into the aqueduct. If this field is true, the aqueduct is currently being restricted.  */
  waterConvservation: boolean(),
  /** The evaluated contimation risk of the zone. See the documentation of the enum for more details. */
  contaminationRisk: levelCategory(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Represents a crop for a given field. */
export const crop = pgTable('crop', {
  /** Auto increment id -- no specific format for IDs for crops */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given management zone */
  managementZone: serial().references(() => managementZone.id, {
    onDelete: 'set null',
  }),
  /** The name of the crop -- realistically, a maximum length of 50 characters would be appropriate, but there's likely some obscure crop that has an extremely long name/variant. */
  name: varchar({ length: 200 }).notNull(),
  /** The date this crop was planted. */
  planted: date({ mode: 'date' }).notNull(),
  /** The date this crop was picked (or collected)/is intended to be picked. Optional. */
  picked: date({ mode: 'date' }),
  /** Is this crop a covercrop? (A covercrop is a crop that is planted not with the intent of being harvested, but with the intent of helping the soil) */
  isCovercrop: boolean(),
  /** Generic notes for each crop (a given client might want to list their reasoning behind using this crop, etc.) */
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Represents a fertilizer that was used on a field */
export const fertilizer = pgTable('fertilizer', {
  /** Auto increment id -- no specific format for IDs for fertilizer */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given management zone */
  managementZone: serial().references(() => managementZone.id, {
    onDelete: 'set null',
  }),
  /** The name of the fertilizer */
  name: varchar({ length: 200 }),
  /** The date that the fertilizer was initially used */
  initial_use: date({ mode: 'date' }).notNull(),
  /** The date that the fertilizer was last used */
  last_used: date({ mode: 'date' }).notNull(),
  /** Generic notes for each livestock */
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Describes some animal/group of animals living on or spending the majority of their time on a given management zone. Also details when this animal/group of animals is "deployed" (when they're in the management zone). */
export const livestock = pgTable('livestock', {
  /** Auto increment id -- no specific format for IDs for livestock */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given management zone */
  managementZone: serial().references(() => managementZone.id, {
    onDelete: 'set null',
  }),
  /** The name/description of the animal currently deployed at a management zone */
  animal: varchar({ length: 200 }),
  /** The date this group of animals was initially deployed. */
  initialDeployment: date({ mode: 'date' }).notNull(),
  /** The date this group of animals was taken out of a management zone. Optional. */
  undeployment: date({ mode: 'date' }),
  /** Is this animal currently deployed? */
  currentlyDeployed: boolean().notNull(),
  /** Generic notes for each livestock */
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** The type of pest, either an insect or a disease. */
export const pestType = pgEnum('pest_type', ['Insect', 'Disease']);

/** Describes a pest -- this "pest" can either be a disease or an insect. */
export const pest = pgTable('pest', {
  /** Auto increment id -- no specific format for IDs for pests */
  id: serial().primaryKey().notNull(),
  /** Foreign key relationship back to given management zone */
  managementZone: serial().references(() => managementZone.id, {
    onDelete: 'set null',
  }),
  /** The formal name of this pest (which may either be a disease or an insect) */
  name: varchar({ length: 200 }).notNull(),
  /** The first time this pest was spotted. */
  initialEncounter: date({ mode: 'date' }).notNull(),
  /** The most recent sighting/occurence of this pest. */
  mostRecentEncounter: date({ mode: 'date' }),
  /** The type of pest. See the pestType enum for more information. */
  type: pestType().notNull(),
  /** Generic notes for each pest */
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
