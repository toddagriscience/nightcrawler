// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getFormBySlug } from '@/lib/sanity/forms';
import type { SanityFormWorkflowType } from '@/lib/sanity/form-types';
import { db } from '@nightcrawler/db';
import { formSubmission } from '@nightcrawler/db/schema';
import { logger } from '@/lib/logger';
import type { ActionResponse } from '@/lib/types/action-response';
import { throwActionError } from '@/lib/utils/actions';
import z from 'zod';
import {
  buildFormAnswersSchema,
  buildStoredFormAnswers,
  flattenFormFields,
  FORM_HONEYPOT_FIELD,
  readRetentionConsentFromValues,
  resolveFormFooterCheckboxes,
  resolveFormSections,
} from './utils';
import { enrichStoredAnswersWithSignupPrefill } from '@nightcrawler/db/utils/extract-applicant-prefill';

/** Payload accepted by {@link submitFormSubmission}. */
export interface SubmitFormSubmissionInput {
  /** Sanity form slug */
  formSlug: string;
  /** Raw form values keyed by field name */
  answers: Record<string, unknown>;
  /** Optional referring article slug */
  sourceArticleSlug?: string;
}

/**
 * Resolves the workflow type from Sanity, defaulting legacy forms to generic.
 *
 * @param workflowType - CMS workflow type when present
 */
function resolveWorkflowType(
  workflowType: SanityFormWorkflowType | undefined
): SanityFormWorkflowType {
  return workflowType ?? 'generic';
}

/**
 * Validates and persists a CMS-driven form submission.
 *
 * @param input - Form slug and field answers
 */
export async function submitFormSubmission(
  input: SubmitFormSubmissionInput
): Promise<ActionResponse> {
  const form = await getFormBySlug(input.formSlug, { cache: 'no-store' });
  if (!form) {
    throwActionError('This form is not available.');
  }

  const workflowType = resolveWorkflowType(form.workflowType);
  const sections = resolveFormSections(form);
  const footerCheckboxes = resolveFormFooterCheckboxes(form);
  const schema = buildFormAnswersSchema(
    flattenFormFields(sections),
    footerCheckboxes
  );
  const validated = schema.safeParse(input.answers);
  if (!validated.success) {
    throwActionError(z.treeifyError(validated.error));
  }

  const honeypot = validated.data[FORM_HONEYPOT_FIELD];
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    logger.warn('Form submission honeypot triggered', {
      formSlug: input.formSlug,
    });
    return { data: { id: null } };
  }

  const retentionConsent = readRetentionConsentFromValues(validated.data);
  const storedAnswers = enrichStoredAnswersWithSignupPrefill(
    buildStoredFormAnswers(validated.data, footerCheckboxes),
    flattenFormFields(sections).map((field) => ({
      name: field.name,
      type: field.type,
    }))
  );

  try {
    const [row] = await db
      .insert(formSubmission)
      .values({
        formSlug: input.formSlug,
        workflowType,
        status: workflowType === 'platform_access' ? 'pending' : null,
        answers: storedAnswers,
        retentionConsent,
        sourceArticleSlug: input.sourceArticleSlug ?? null,
      })
      .returning({ id: formSubmission.id });

    return { data: { id: row?.id ?? null } };
  } catch (error) {
    logger.error('Form submission failed', error);
    throwActionError('Unable to submit your request. Please try again.');
  }
}

/** @deprecated Use {@link submitFormSubmission}. */
export const submitPlatformAccessApplication = submitFormSubmission;

/** @deprecated Use {@link SubmitFormSubmissionInput}. */
export type SubmitPlatformAccessApplicationInput = SubmitFormSubmissionInput;
