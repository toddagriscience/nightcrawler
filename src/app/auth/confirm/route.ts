// Copyright Todd Agriscience, Inc. All rights reserved.

import { createClient } from '@/lib/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates that a redirect path is safe (relative path only, no external URLs)
 * @param path - The path to validate
 * @returns {boolean} - Whether the path is safe for redirect
 */
function isValidRedirectPath(path: string): boolean {
  // Only allow relative paths that start with /
  if (!path.startsWith('/')) {
    return false;
  }
  
  // Prevent protocol-relative URLs (//example.com)
  if (path.startsWith('//')) {
    return false;
  }
  
  // Prevent URLs with protocols
  if (path.includes('://')) {
    return false;
  }
  
  return true;
}

/**
 * Logic in this function is primarily from https://supabase.com/docs/guides/auth/passwords?queryGroups=flow&flow=pkce&queryGroups=framework&framework=nextjs#resetting-a-password
 *
 * Because the logic in this function is a near-exact copy of the logic from Supabase, it will not be tested.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const nextParam = searchParams.get('next') ?? '/';
  
  // Validate the redirect path to prevent open redirect vulnerabilities
  const next = isValidRedirectPath(nextParam) ? nextParam : '/';
  
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = '/auth/error/auth-code';
  return NextResponse.redirect(redirectTo);
}
