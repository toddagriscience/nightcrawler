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
import { integratedManagementPlan } from './integrated-management-plan';
import { knowledgeArticle } from './knowledge';

/**
 * Searchable and purchasable seed product available in the Todd platform.
 * Seed products are stored separately from knowledge articles so product
 * metadata can evolve without overloading the IMP schema.
 */
export const seedProduct = pgTable(
  'seed_product',
  {
    /** Auto increment id */
    id: serial().primaryKey().notNull(),
    /** Shared knowledge row used for search embedding and timestamps. */
    knowledgeArticleId: integer()
      .references(() => knowledgeArticle.id, { onDelete: 'cascade' })
      .notNull(),
    /** Customer-facing product name */
    name: varchar({ length: 200 }).notNull(),
    /** URL-safe product slug used by `/product/[slug]` */
    slug: varchar({ length: 200 }).notNull().unique(),
    /** General seed information shown on the detail page and in search */
    description: text().notNull(),
    /** Remaining units available for ordering */
    stock: integer().notNull().default(0),
    /** Price per unit in cents */
    priceInCents: integer().notNull(),
    /** Unit label used when displaying price and quantity */
    unit: varchar({ length: 50 }).notNull().default('lb'),
    /** Optional image URL or absolute path that can point at Cloudflare R2 */
    imageUrl: varchar({ length: 500 }),
    /** Optional advisor contact URL for the product detail page CTA */
    advisorContactUrl: varchar({ length: 500 }).default('/contact'),
    /** Optional related IMP that gives supporting agronomic context. */
    relatedIntegratedManagementPlanId: integer().references(
      () => integratedManagementPlan.id,
      {
        onDelete: 'set null',
      }
    ),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.knowledgeArticleId)]
);
