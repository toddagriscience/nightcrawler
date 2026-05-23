// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getFormBySlug } from '@/lib/sanity/forms';
import { db } from '@nightcrawler/db';
import { platformAccessApplication } from '@nightcrawler/db/schema';
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

/** Payload accepted by {@link submitPlatformAccessApplication}. */
export interface SubmitPlatformAccessApplicationInput {
  /** Sanity form slug */
  formSlug: string;
  /** Raw form values keyed by field name */
  answers: Record<string, unknown>;
  /** Optional referring article slug */
  sourceArticleSlug?: string;
}

/**
 * Validates and persists a CMS-driven access request submission.
 *
 * @param input - Form slug and field answers
 */
export async function submitPlatformAccessApplication(
  input: SubmitPlatformAccessApplicationInput
): Promise<ActionResponse> {
  const form = await getFormBySlug(input.formSlug, { cache: 'no-store' });
  if (!form) {
    throwActionError('This form is not available.');
  }

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
    logger.warn('Platform access form honeypot triggered', {
      formSlug: input.formSlug,
    });
    return { data: { id: null } };
  }

  const retentionConsent = readRetentionConsentFromValues(validated.data);
  const storedAnswers = buildStoredFormAnswers(
    validated.data,
    footerCheckboxes
  );

  try {
    const [row] = await db
      .insert(platformAccessApplication)
      .values({
        formSlug: input.formSlug,
        answers: storedAnswers,
        retentionConsent,
        sourceArticleSlug: input.sourceArticleSlug ?? null,
      })
      .returning({ id: platformAccessApplication.id });

    return { data: { id: row?.id ?? null } };
  } catch (error) {
    logger.error('Platform access application submission failed', error);
    throwActionError('Unable to submit your request. Please try again.');
  }
}
