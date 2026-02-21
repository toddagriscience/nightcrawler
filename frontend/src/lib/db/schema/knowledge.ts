// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  vector,
} from 'drizzle-orm/pg-core';

/** Categories for Todd's knowledge base content */
export const knowledgeCategoryEnum = pgEnum('knowledge_category', [
  'soil',
  'planting',
  'water',
  'insects_disease',
  'harvest_storage',
  'go_to_market',
  'seed_products',
]);

/** A piece of human-written content in Todd's knowledge base. Searchable by farmers via semantic search. */
export const knowledgeArticle = pgTable('knowledge_article', {
  /** Auto increment id */
  id: serial().primaryKey().notNull(),
  /** Title of the article or guide section */
  title: varchar({ length: 500 }).notNull(),
  /** The full human-written content */
  content: text().notNull(),
  /** Which topic category this belongs to */
  category: knowledgeCategoryEnum().notNull(),
  /** Where this content came from (e.g. "Todd Field Guide", "Vincent Todd", "Seed Catalog") */
  source: varchar({ length: 200 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  embedding: vector({ dimensions: 3072 }),
});
