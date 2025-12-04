// Copyright Todd Agriscience, Inc. All rights reserved.

import { createClient } from '@/lib/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Logic in this function is primarily from https://supabase.com/docs/guides/auth/passwords?queryGroups=flow&flow=pkce&queryGroups=framework&framework=nextjs#resetting-a-password
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';
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

  redirectTo.pathname = '/auth/auth-code-error';
  return NextResponse.redirect(redirectTo);
}
