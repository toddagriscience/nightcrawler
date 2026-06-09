// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import {
  farm,
  internalAccount,
  platformAccessApplication,
} from '@nightcrawler/db/schema';
import { createClient } from '@/lib/supabase/server';
import { issueApprovedApplicantSignupAccess } from '@/lib/platform-access/issue-approved-applicant-signup';
import { and, desc, eq, isNull } from 'drizzle-orm';
import logger from '@/lib/logger';

/**
 * Resolves the active internal account for the current Supabase session.
 */
async function getReviewerAccountId(): Promise<number | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  if (!email) return null;

  const [account] = await db
    .select({ id: internalAccount.id })
    .from(internalAccount)
    .where(
      and(eq(internalAccount.email, email), eq(internalAccount.isActive, true))
    )
    .limit(1);

  return account?.id ?? null;
}

/**
 * Fetches one platform access application by id.
 *
 * @param id - Application row id
 */
export async function getPlatformAccessApplicationById(id: number) {
  try {
    const [application] = await db
      .select()
      .from(platformAccessApplication)
      .where(
        and(
          eq(platformAccessApplication.id, id),
          eq(platformAccessApplication.workflowType, 'platform_access'),
          isNull(platformAccessApplication.deletedAt)
        )
      )
      .limit(1);

    return application ?? null;
  } catch (error) {
    logger.error('Failed to fetch platform access application:', error);
    return null;
  }
}

/** Filters for {@link getPlatformAccessApplications}. */
export interface PlatformAccessApplicationListFilters {
  /** Optional workflow status filter */
  status?: 'pending' | 'approved' | 'rejected';
  /** Optional CMS form slug filter (e.g. `iris-access`) */
  formSlug?: string;
}

/**
 * Lists platform access applications, optionally filtered by status or form slug.
 *
 * @param filters - Optional list filters
 */
export async function getPlatformAccessApplications(
  filters?: PlatformAccessApplicationListFilters
) {
  try {
    const conditions = [
      isNull(platformAccessApplication.deletedAt),
      eq(platformAccessApplication.workflowType, 'platform_access'),
    ];
    if (filters?.status) {
      conditions.push(eq(platformAccessApplication.status, filters.status));
    }
    if (filters?.formSlug) {
      conditions.push(eq(platformAccessApplication.formSlug, filters.formSlug));
    }

    return await db
      .select()
      .from(platformAccessApplication)
      .where(and(...conditions))
      .orderBy(desc(platformAccessApplication.createdAt));
  } catch (error) {
    logger.error('Failed to fetch platform access applications:', error);
    return [];
  }
}

/**
 * Approves an application, sends a signup email, and returns a fallback signup URL.
 *
 * @param id - Application row id
 */
export async function approvePlatformAccessApplication(id: number) {
  try {
    const reviewerId = await getReviewerAccountId();
    const [existing] = await db
      .select()
      .from(platformAccessApplication)
      .where(eq(platformAccessApplication.id, id))
      .limit(1);

    if (!existing) {
      return {
        application: null,
        signupUrl: null,
        emailSent: false,
        emailError: 'Application not found.',
      };
    }

    const [application] = await db
      .update(platformAccessApplication)
      .set({
        status: 'approved',
        reviewedByInternalAccountId: reviewerId,
        reviewedAt: new Date(),
      })
      .where(eq(platformAccessApplication.id, id))
      .returning();

    if (!application) {
      return {
        application: null,
        signupUrl: null,
        emailSent: false,
        emailError: 'Failed to approve application.',
      };
    }

    return issueApprovedApplicantSignupAccess(id);
  } catch (error) {
    logger.error('Failed to approve platform access application:', error);
    return {
      application: null,
      signupUrl: null,
      emailSent: false,
      emailError: 'Failed to approve application.',
    };
  }
}

/**
 * Resends a fresh magic-link email for an approved application.
 *
 * @param id - Application row id
 */
export async function resendPlatformAccessApplicationInvite(id: number) {
  try {
    return await issueApprovedApplicantSignupAccess(id);
  } catch (error) {
    logger.error('Failed to resend platform access application invite:', error);
    return {
      application: null,
      signupUrl: null,
      emailSent: false,
      emailError: 'Failed to resend invite email.',
    };
  }
}

/**
 * Rejects an application and applies retention policy.
 *
 * @param id - Application row id
 */
export async function rejectPlatformAccessApplication(id: number) {
  try {
    const reviewerId = await getReviewerAccountId();
    const [existing] = await db
      .select()
      .from(platformAccessApplication)
      .where(eq(platformAccessApplication.id, id))
      .limit(1);

    if (!existing) return null;

    const shouldDelete = !existing.retentionConsent;

    const [application] = await db
      .update(platformAccessApplication)
      .set({
        status: 'rejected',
        reviewedByInternalAccountId: reviewerId,
        reviewedAt: new Date(),
        deletedAt: shouldDelete ? new Date() : null,
        answers: shouldDelete ? {} : existing.answers,
      })
      .where(eq(platformAccessApplication.id, id))
      .returning();

    return application;
  } catch (error) {
    logger.error('Failed to reject platform access application:', error);
    return null;
  }
}

/**
 * Loads advisor-maintained farm profile notes for a linked farm.
 *
 * @param farmId - Farm id from an approved application
 */
export async function getFarmAdvisorProfileNotes(
  farmId: number
): Promise<string> {
  try {
    const [row] = await db
      .select({ advisorProfileNotes: farm.advisorProfileNotes })
      .from(farm)
      .where(eq(farm.id, farmId))
      .limit(1);

    return row?.advisorProfileNotes ?? '';
  } catch (error) {
    logger.error('Failed to load farm advisor profile notes:', error);
    return '';
  }
}

/**
 * Saves advisor-maintained farm profile notes.
 *
 * @param farmId - Farm id to update
 * @param notes - Markdown-style profile content
 */
export async function updateFarmAdvisorProfileNotes(
  farmId: number,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const reviewerId = await getReviewerAccountId();
    if (!reviewerId) {
      return { success: false, error: 'Not authorized.' };
    }

    if (!Number.isFinite(farmId)) {
      return { success: false, error: 'Invalid farm id.' };
    }

    await db
      .update(farm)
      .set({ advisorProfileNotes: notes })
      .where(eq(farm.id, farmId));

    return { success: true };
  } catch (error) {
    logger.error('Failed to update farm advisor profile notes:', error);
    return { success: false, error: 'Failed to save notes.' };
  }
}
