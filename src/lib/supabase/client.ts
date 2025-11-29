// Copyright Todd Agriscience, Inc. All rights reserved.
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!}.supabase.co`,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
