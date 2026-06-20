// Copyright © Todd Agriscience, Inc. All rights reserved.

import { db } from '@nightcrawler/db';
import { internalAccount } from '@nightcrawler/db/schema';
import { and, eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

/** An authenticated, active internal dashboard account. */
export interface InternalAccount {
  /** `internal_account` row id */
  id: number;
  /** Account email (matches the Supabase session email) */
  email: string;
}

/**
 * Authorizes the current request against the internal dashboard.
 *
 * Resolves the Supabase session, then verifies the caller owns an active row
 * in `internal_account`. Server actions are publicly reachable POST endpoints,
 * so each one must authorize independently of the middleware — middleware
 * alone is not a sufficient authorization boundary (an action can be invoked
 * directly). Call this at the top of every internal server action.
 *
 * Mirrors the lookup in `proxy/auth.ts` so the action layer and the middleware
 * agree on who counts as an internal member.
 *
 * @returns The caller's active internal account
 * @throws {Error} `Unauthorized` when there is no valid session or no active account
 */
export async function requireInternalAccount(): Promise<InternalAccount> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;

  if (!email) {
    throw new Error('Unauthorized');
  }

  const [account] = await db
    .select({ id: internalAccount.id })
    .from(internalAccount)
    .where(
      and(eq(internalAccount.email, email), eq(internalAccount.isActive, true))
    )
    .limit(1);

  if (!account) {
    throw new Error('Unauthorized');
  }

  return { id: account.id, email };
}
