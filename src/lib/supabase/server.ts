// Copyright Todd Agriscience, Inc. All rights reserved.
'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import logger from '../logger';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!}.supabase.co`,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) =>
              cookieStore.set(name, value)
            );
          } catch (error) {
            logger.warn(`Setting cookies failed: ${error}`);
          }
        },
      },
    }
  );
}
