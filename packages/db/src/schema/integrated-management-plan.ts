// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { analysis } from './analysis';
import { knowledgeArticle } from './knowledge';
import { managementZone } from './management-zone';

/** Categories for Todd's integrated management plans. */
export const integratedManagementPlanCategoryEnum = pgEnum(
  'knowledge_category',
  [
    'soil',
    'planting',
    'water',
    'insects_disease',
    'harvest_storage',
    'go_to_market',
    'seed_products',
  ]
);

/**
 * Informally referred to as an IMP, an integrated management plan owns the
 * human-readable IMP content while its related knowledge row owns the shared
 * embedding used for search.
 */
export const integratedManagementPlan = pgTable(
  'integrated_management_plan',
  {
    /** Auto increment id for the IMP record. */
    id: serial().primaryKey().notNull(),
    /** Shared knowledge row used for search embedding and timestamps. */
    knowledgeArticleId: integer()
      .references(() => knowledgeArticle.id, { onDelete: 'cascade' })
      .notNull(),
    /** Customer-facing IMP title. */
    title: varchar({ length: 500 }).notNull(),
    /** URL-safe identifier used in `/imp/[slug]`. */
    slug: varchar({ length: 500 }).notNull(),
    /** Full IMP content rendered on the detail page. */
    content: text().notNull(),
    /** IMP topic category shown in search and detail pages. */
    category: integratedManagementPlanCategoryEnum().notNull(),
    /** Source attribution shown in the IMP UI. */
    source: varchar({ length: 200 }),
    /** Foreign key relationship back to the given management zone. */
    managementZone: integer().references(() => managementZone.id, {
      onDelete: 'set null',
    }),
    /** Foreign key relationship to the given analysis. */
    analysis: varchar({ length: 13 }).references(() => analysis.id, {
      onDelete: 'set null',
    }),
    /** Written plan for the management zone, when applicable. */
    plan: text(),
    /** The date this plan was first written. */
    initialized: date({ mode: 'date' }).notNull(),
    /** The date this plan was later updated, if it ever was. */
    updated: date({ mode: 'date' }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.knowledgeArticleId), unique().on(table.slug)]
);
