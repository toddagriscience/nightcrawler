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

/** Review status for platform-access workflow submissions. */
export const formSubmissionStatusEnum = pgEnum('form_submission_status', [
  'pending',
  'approved',
  'rejected',
]);

/** Determines post-submit handling for a CMS form submission. */
export const formSubmissionWorkflowTypeEnum = pgEnum(
  'form_submission_workflow_type',
  ['generic', 'platform_access']
);

/**
 * CMS-driven form submission at `/forms/[slug]`.
 * Form structure lives in Sanity; answers and optional workflow live here.
 */
export const formSubmission = pgTable('form_submissions', {
  /** Auto increment id */
  id: serial().primaryKey().notNull(),
  /** Sanity form slug */
  formSlug: varchar({ length: 96 }).notNull(),
  /** Post-submit workflow copied from Sanity at insert time */
  workflowType: formSubmissionWorkflowTypeEnum().notNull().default('generic'),
  /** Review workflow status — platform_access only */
  status: formSubmissionStatusEnum(),
  /** Field answers keyed by Sanity `formField.name` */
  answers: jsonb().$type<Record<string, unknown>>().notNull(),
  /** Whether the applicant consented to data retention after rejection */
  retentionConsent: boolean().notNull(),
  /** Optional article slug that referred the submitter */
  sourceArticleSlug: varchar({ length: 200 }),
  /** Internal reviewer account id */
  reviewedByInternalAccountId: integer().references(() => internalAccount.id),
  /** When the submission was reviewed */
  reviewedAt: timestamp(),
  /** Single-use signup token issued on approval */
  signupToken: uuid(),
  /** Expiry for the signup token */
  signupTokenExpiresAt: timestamp(),
  /** When the approval invite email was sent */
  inviteSentAt: timestamp(),
  /** When the applicant finished account + farm creation */
  signedUpAt: timestamp(),
  /** Farm created from an approved platform-access submission */
  farmId: integer().references(() => farm.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  /** Soft delete timestamp (reject without retention consent) */
  deletedAt: timestamp(),
});

/** @deprecated Use {@link formSubmission}. */
export const platformAccessApplication = formSubmission;

/** @deprecated Use {@link formSubmissionStatusEnum}. */
export const platformAccessApplicationStatusEnum = formSubmissionStatusEnum;
