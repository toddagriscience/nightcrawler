// Copyright © Todd Agriscience, Inc. All rights reserved.

import { pgTable, serial, timestamp, vector } from 'drizzle-orm/pg-core';

/**
 * Shared searchable knowledge row.
 * Specialized tables such as seed products and IMPs own the human-readable
 * metadata, while this table only stores the shared embedding lifecycle.
 */
export const knowledgeArticle = pgTable('knowledge_article', {
  /** Auto increment id */
  id: serial().primaryKey().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  /** Semantic-search embedding shared by normalized knowledge-backed content. */
  embedding: vector({ dimensions: 3072 }),
});
