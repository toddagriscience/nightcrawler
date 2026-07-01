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
 * A general Integrated Management Practice (IMP), mirrored from Vincent's
 * "Integrated Management Practices" Google Sheet tab. Each row pairs a body of
 * advice with keyword tags and an optional trigger condition that decides when
 * the practice applies. The sheet is the source of truth; this table is a
 * regenerable mirror (see scripts/import-general-imps.ts).
 */
export const generalImp = pgTable(
  'general_imp',
  {
    /** Auto increment id */
    id: serial().primaryKey().notNull(),
    /** Shared knowledge row used for search embedding and timestamps. */
    knowledgeArticleId: integer()
      .references(() => knowledgeArticle.id, { onDelete: 'cascade' })
      .notNull(),
    /** Optional heading — only "concept" rows carry one, e.g. "Copper". */
    title: varchar({ length: 300 }),
    /** URL-safe slug, unique across IMPs. */
    slug: varchar({ length: 300 }).notNull().unique(),
    /** Keyword tags from the sheet's Category column (crops, conditions, pests). */
    tags: text().array().notNull().default([]),
    /**
     * Raw trigger expression from the sheet's "Trigger (all must be true)"
     * column, e.g. `low @zinc`, `@four_lows`, `@water + @irrigation "yes"`.
     * Stored verbatim; parsed into structured conditions in a later phase.
     * Null means the practice is always applicable (a reference concept).
     */
    triggerRaw: text(),
    /** The client-facing advice body (the sheet's Body column). */
    content: text().notNull(),
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
