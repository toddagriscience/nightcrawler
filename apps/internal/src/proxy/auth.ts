// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createServerClient } from '@supabase/ssr';
import { db } from '@nightcrawler/db';
import { internalAccount } from '@nightcrawler/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

/** Result of the authentication and internal account check */
interface AuthResult {
  /** The Supabase-aware response that preserves cookie state */
  response: NextResponse;
  /** Whether the user has a valid Supabase session */
  isAuthenticated: boolean;
  /** Whether the authenticated user owns an active internal account */
  hasInternalAccount: boolean;
}

/**
 * Handles authentication and internal-account verification for the
 * internal dashboard. Creates a Supabase server client, refreshes the
 * session via `getClaims()`, then looks up the caller's email in the
 * `internal_account` table.
 *
 * @param request - The incoming Next.js request
 * @returns An {@link AuthResult} indicating auth and account status
 */
export async function handleAuthRouting(
  request: NextRequest
): Promise<AuthResult> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!}.supabase.co`,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not add logic between createServerClient and getClaims().
  // A simple mistake here could silently break session refresh.
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return {
      response: supabaseResponse,
      isAuthenticated: false,
      hasInternalAccount: false,
    };
  }

  const email = data.claims.email as string | undefined;

  if (!email) {
    return {
      response: supabaseResponse,
      isAuthenticated: true,
      hasInternalAccount: false,
    };
  }

  // Verify the caller has an active row in the internal_account table
  const [account] = await db
    .select({ id: internalAccount.id })
    .from(internalAccount)
    .where(
      and(eq(internalAccount.email, email), eq(internalAccount.isActive, true))
    )
    .limit(1);

  return {
    response: supabaseResponse,
    isAuthenticated: true,
    hasInternalAccount: !!account,
  };
}
