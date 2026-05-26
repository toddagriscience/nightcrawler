// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { db } from '@nightcrawler/db';
import {
  internalAccount,
  platformAccessApplication,
} from '@nightcrawler/db/schema';
import { createClient } from '@/lib/supabase/server';
import { buildIncomingSignupUrl } from '@/lib/platform-access/build-incoming-signup-url';
import { and, desc, eq, isNull } from 'drizzle-orm';
import logger from '@/lib/logger';

/** Base URL for generated signup links. */
function getSiteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ??
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

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
    const conditions = [isNull(platformAccessApplication.deletedAt)];
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
 * Approves an application and returns a pre-filled signup URL.
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

    if (!existing) return { application: null, signupUrl: null };

    const signupToken = crypto.randomUUID();
    const signupTokenExpiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 14
    );

    const [application] = await db
      .update(platformAccessApplication)
      .set({
        status: 'approved',
        reviewedByInternalAccountId: reviewerId,
        reviewedAt: new Date(),
        signupToken,
        signupTokenExpiresAt,
      })
      .where(eq(platformAccessApplication.id, id))
      .returning();

    const signupUrl = buildIncomingSignupUrl(
      getSiteBaseUrl(),
      (application?.answers ?? {}) as Record<string, unknown>
    );

    return { application, signupUrl };
  } catch (error) {
    logger.error('Failed to approve platform access application:', error);
    return { application: null, signupUrl: null };
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
