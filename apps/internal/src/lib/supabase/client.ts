// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser-side usage.
 * @returns Supabase browser client instance
 */
export function createClient() {
  return createBrowserClient(
    `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!}.supabase.co`,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
