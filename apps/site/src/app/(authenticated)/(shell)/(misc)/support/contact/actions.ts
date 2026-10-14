// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { logger } from '@/lib/logger';
import { createRateLimiter } from '@/lib/rate-limit';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasCompletedPlatformOnboarding } from '@/lib/utils/platform-onboarding';
import { hasAcceptedAccountAgreement } from '@/lib/utils/account-agreement';
import type { AuthenticatedInfo } from '@/lib/types/get-authenticated-info';
import { db } from '@nightcrawler/db/schema/connection';
import { formSubmission, managementZone } from '@nightcrawler/db/schema';
import { contactSchema } from './schema';
import type { ContactInput, ContactResult } from './types';
import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { loadInferenceContactContext } from './inference-context';
import { INFERENCE_CONTACT_LIFETIME_MS } from './inference-schema';

const contactRateLimit = createRateLimiter({
  requests: 5,
  window: '60 s',
  prefix: 'site:iris-contact',
});

/**
 * Sends a client's message to the internal inquiries inbox using the existing
 * generic submission table. The caller cannot choose a sender, farm or workflow.
 *
 * @param input - Subject and message from the authenticated contact form
 */
export async function submitClientContact(
  input: ContactInput,
  contextToken?: string
): Promise<ContactResult> {
  let currentUser: AuthenticatedInfo;
  try {
    currentUser = await getAuthenticatedInfo();
  } catch {
    return {
      success: false,
      message: 'Please sign in again before sending your message.',
    };
  }

  try {
    if (
      currentUser.role === 'Viewer' &&
      !(await hasAcceptedAccountAgreement(currentUser.id))
    ) {
      return {
        success: false,
        message: 'Accept your account agreement before sending your message.',
      };
    }
    if (
      !(await hasCompletedPlatformOnboarding(
        currentUser.id,
        currentUser.approved
      ))
    ) {
      return {
        success: false,
        message: 'Complete your account setup before contacting your advisor.',
      };
    }

    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message ?? 'Check your subject and message.',
      };
    }

    if (!(await contactRateLimit(`user:${currentUser.id}`)).success) {
      return {
        success: false,
        message: 'Please wait a minute before sending another message.',
      };
    }

    const context = contextToken
      ? await loadInferenceContactContext(contextToken)
      : null;
    if (contextToken && !context) {
      return {
        success: false,
        message:
          'Your saved search is no longer available. Start a new search or contact your advisor directly.',
      };
    }
    const answers = {
      subject: parsed.data.subject,
      message: parsed.data.message,
      userId: currentUser.id,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      senderEmail: currentUser.email,
      ...(context
        ? {
            source: 'inference',
            questions: context.questions,
            managementZoneId: context.managementZone?.id ?? null,
            managementZoneName: context.managementZone?.name ?? null,
          }
        : {}),
    };
    // Promoting a draft is atomic and single-use; an unsent draft stays out of the staff inbox.
    if (context) {
      const [request] = await db
        .update(formSubmission)
        .set({ formSlug: 'iris-contact', answers, createdAt: sql`now()` })
        .where(
          and(
            eq(formSubmission.id, context.id),
            eq(formSubmission.formSlug, 'iris-contact-draft'),
            eq(formSubmission.workflowType, 'generic'),
            eq(formSubmission.farmId, currentUser.farmId),
            sql`${formSubmission.answers}->>'userId' = ${String(currentUser.id)}`,
            sql`${formSubmission.answers}->>'contextToken' = ${context.token}`,
            gt(
              formSubmission.createdAt,
              sql`now() - ${INFERENCE_CONTACT_LIFETIME_MS} * interval '1 millisecond'`
            ),
            isNull(formSubmission.deletedAt),
            context.managementZone
              ? sql`exists (select 1 from ${managementZone} where ${managementZone.id} = ${context.managementZone.id} and ${managementZone.farmId} = ${currentUser.farmId})`
              : undefined
          )
        )
        .returning({ id: formSubmission.id });
      if (!request)
        return {
          success: false,
          message:
            'Your saved search was already sent or has expired. Please start a new search.',
        };
      return { success: true, id: request.id };
    }
    const [request] = await db
      .insert(formSubmission)
      .values({
        formSlug: 'iris-contact',
        workflowType: 'generic',
        status: null,
        farmId: currentUser.farmId,
        retentionConsent: false,
        answers,
      })
      .returning({ id: formSubmission.id });

    if (!request) throw new Error('Contact insert did not return a request.');
    return { success: true, id: request.id };
  } catch (error) {
    logger.error('Unable to store a client contact request', error);
    return {
      success: false,
      message: 'Your message could not be sent. Please try again.',
    };
  }
}
