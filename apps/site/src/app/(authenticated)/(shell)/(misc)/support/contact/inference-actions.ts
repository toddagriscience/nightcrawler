// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { randomUUID } from 'node:crypto';
import { logger } from '@/lib/logger';
import { createRateLimiter } from '@/lib/rate-limit';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasAcceptedAccountAgreement } from '@/lib/utils/account-agreement';
import { hasCompletedPlatformOnboarding } from '@/lib/utils/platform-onboarding';
import { db } from '@nightcrawler/db/schema/connection';
import { formSubmission, managementZone } from '@nightcrawler/db/schema';
import { and, eq, lt, sql } from 'drizzle-orm';
import {
  INFERENCE_CONTACT_LIFETIME_MS,
  inferenceContactSchema,
} from './inference-schema';
import type { InferenceContactInput, InferenceContactResult } from './types';

const handoffRateLimit = createRateLimiter({
  requests: 5,
  window: '60 s',
  prefix: 'site:iris-contact-handoff',
});

/**
 * Saves an unsubmitted inference draft for this client and returns its opaque URL.
 * No question, zone name, or client identity is placed in browser URLs.
 */
export async function prepareInferenceContact(
  input: InferenceContactInput
): Promise<InferenceContactResult> {
  try {
    const currentUser = await getAuthenticatedInfo();
    if (
      (currentUser.role === 'Viewer' &&
        !(await hasAcceptedAccountAgreement(currentUser.id))) ||
      !(await hasCompletedPlatformOnboarding(
        currentUser.id,
        currentUser.approved
      ))
    )
      return {
        success: false,
        message: 'Complete your account setup before contacting your advisor.',
      };
    const parsed = inferenceContactSchema.safeParse(input);
    if (!parsed.success)
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message ||
          'Check your questions and try again.',
      };
    let zoneName: string | null = null;
    if (parsed.data.managementZoneId !== undefined) {
      const [zone] = await db
        .select({ name: managementZone.name })
        .from(managementZone)
        .where(
          and(
            eq(managementZone.id, parsed.data.managementZoneId),
            eq(managementZone.farmId, currentUser.farmId)
          )
        )
        .limit(1);
      if (!zone)
        return {
          success: false,
          message:
            'This management zone is no longer available. Start a new search and try again.',
        };
      zoneName = zone.name || 'Unnamed zone';
    }
    if (!(await handoffRateLimit(`user:${currentUser.id}`)).success)
      return {
        success: false,
        message: 'Please wait a minute before transferring another search.',
      };
    // Remove this user's expired drafts on the next handoff; keep other users' data untouched.
    await db
      .delete(formSubmission)
      .where(
        and(
          eq(formSubmission.formSlug, 'iris-contact-draft'),
          eq(formSubmission.workflowType, 'generic'),
          eq(formSubmission.farmId, currentUser.farmId),
          sql`${formSubmission.answers}->>'userId' = ${String(currentUser.id)}`,
          lt(
            formSubmission.createdAt,
            sql`now() - ${INFERENCE_CONTACT_LIFETIME_MS} * interval '1 millisecond'`
          )
        )
      );
    const token = randomUUID();
    const [draft] = await db
      .insert(formSubmission)
      .values({
        formSlug: 'iris-contact-draft',
        workflowType: 'generic',
        status: null,
        farmId: currentUser.farmId,
        retentionConsent: false,
        answers: {
          userId: currentUser.id,
          contextToken: token,
          questions: parsed.data.questions,
          managementZoneId: parsed.data.managementZoneId ?? null,
          managementZoneName: zoneName,
        },
      })
      .returning({ id: formSubmission.id });
    if (!draft) throw new Error('Inference draft insert did not return a row.');
    return { success: true, url: `/support/contact?context=${token}` };
  } catch (error) {
    logger.error('Unable to prepare an inference contact request', error);
    return {
      success: false,
      message: 'Your questions could not be transferred. Please try again.',
    };
  }
}
