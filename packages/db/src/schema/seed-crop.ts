// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { knowledgeArticle } from './knowledge';

/**
 * A catalog crop group (e.g. "BASIL", "BEET") imported from the Variety
 * Inventory sheet. Owns the crop-level growing description; individual
 * cultivars live in `seed_variety` and reference their parent crop.
 *
 * Distinct from the operational `crop` table (a crop planted in a management
 * zone). Regenerable mirror of the source spreadsheet — the importer rebuilds
 * it, so edits belong in the sheet, not here.
 */
export const seedCrop = pgTable(
  'seed_crop',
  {
    /** Auto increment id */
    id: serial().primaryKey().notNull(),
    /** Shared knowledge row used for search embedding and timestamps. */
    knowledgeArticleId: integer()
      .references(() => knowledgeArticle.id, { onDelete: 'cascade' })
      .notNull(),
    /** Crop group name as it appears in the inventory sheet. */
    name: varchar({ length: 200 }).notNull(),
    /** URL-safe crop slug. */
    slug: varchar({ length: 200 }).notNull().unique(),
    /** Crop-level growing description, embedded for search. */
    description: text(),
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