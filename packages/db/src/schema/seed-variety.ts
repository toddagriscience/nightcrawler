// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { knowledgeArticle } from './knowledge';
import { seedCrop } from './seed-crop';

/**
 * Request availability for a variety, derived from the sheet's Inventory column:
 * a seed count → `available`, blank/"n/a" → `back_order`, "Cultivar Descrpt." →
 * `reference` (a historical record that is not requestable).
 */
export const seedVarietyStatusEnum = pgEnum('seed_variety_status', [
  'available',
  'back_order',
  'reference',
]);

/**
 * A cultivar nested under a seed crop, imported from the Variety Inventory
 * sheet. Owns variety-specific description, request status, display-only
 * pricing, and seed-bank metadata. Regenerable mirror — edits belong in the
 * sheet.
 */
export const seedVariety = pgTable(
  'seed_variety',
  {
    /** Auto increment id */
    id: serial().primaryKey().notNull(),
    /** Shared knowledge row used for search embedding and timestamps. */
    knowledgeArticleId: integer()
      .references(() => knowledgeArticle.id, { onDelete: 'cascade' })
      .notNull(),
    /** Parent catalog crop group. */
    seedCropId: integer()
      .references(() => seedCrop.id, { onDelete: 'cascade' })
      .notNull(),
    /** Variety/cultivar name. */
    name: varchar({ length: 200 }).notNull(),
    /** URL-safe slug; crop-prefixed to stay unique across crops. */
    slug: varchar({ length: 300 }).notNull().unique(),
    /** Variety description / growing notes, embedded for search. */
    description: text(),
    /** Whether a client may request this variety. */
    status: seedVarietyStatusEnum().notNull().default('back_order'),
    /** Display-only price per ounce, in cents. */
    pricePerOzCents: integer(),
    /** Display-only price per pound, in cents. */
    pricePerLbCents: integer(),
    /** Display-only price per plant, in cents. */
    pricePerPlantCents: integer(),
    /** Raw seed-bank inventory note from the sheet, e.g. "25 Seeds". */
    inventoryNote: varchar({ length: 200 }),
    /** Year the seed lot was last produced, as recorded in the sheet. */
    lastProduced: varchar({ length: 50 }),
    /** Physical storage location from the sheet. */
    location: varchar({ length: 200 }),
    /** Hash of the text last embedded; lets re-imports skip unchanged rows. */
    sourceContentHash: varchar({ length: 64 }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.knowledgeArticleId)]
);
