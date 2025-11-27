// Copyright Todd Agriscience, Inc. All rights reserved.
import { createClient } from '@supabase/supabase-js';

const projectId =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || 'NO_PROJECT_ID';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NO_ANON_KEY';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  anonKey
);
