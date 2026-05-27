// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { farm } from './farm';
import { internalAccount } from './internal-account';

/** Review status for a platform access application submission. */
export const platformAccessApplicationStatusEnum = pgEnum(
  'platform_access_application_status',
  ['pending', 'approved', 'rejected']
);

/**
 * A CMS-driven access request submission (e.g. `/forms/iris-access`).
 * Form structure lives in Sanity; answers and workflow live here.
 */
export const platformAccessApplication = pgTable(
  'platform_access_application',
  {
    /** Auto increment id */
    id: serial().primaryKey().notNull(),
    /** Sanity form slug */
    formSlug: varchar({ length: 96 }).notNull(),
    /** Review workflow status */
    status: platformAccessApplicationStatusEnum().notNull().default('pending'),
    /** Field answers keyed by Sanity `formField.name` */
    answers: jsonb().$type<Record<string, unknown>>().notNull(),
    /** Whether the applicant consented to data retention after rejection */
    retentionConsent: boolean().notNull(),
    /** Optional article slug that referred the applicant */
    sourceArticleSlug: varchar({ length: 200 }),
    /** Internal reviewer account id */
    reviewedByInternalAccountId: integer().references(() => internalAccount.id),
    /** When the application was reviewed */
    reviewedAt: timestamp(),
    /** Single-use signup token issued on approval */
    signupToken: uuid(),
    /** Expiry for the signup token */
    signupTokenExpiresAt: timestamp(),
    /** When the approval invite email was sent */
    inviteSentAt: timestamp(),
    /** When the applicant finished account + farm creation */
    signedUpAt: timestamp(),
    /** Farm created from this approved application */
    farmId: integer().references(() => farm.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    /** Soft delete timestamp (reject without retention consent) */
    deletedAt: timestamp(),
  }
);
