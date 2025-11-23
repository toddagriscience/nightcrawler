// Copyright Todd Agriscience, Inc. All rights reserved.
import { createClient } from '@supabase/supabase-js';

const projectId = process.env.SUPABASE_PROJECT_ID || 'NO_PROJECT_ID';
const anonKey = process.env.SUPABASE_ANON_KEY || 'NO_ANON_KEY';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  anonKey
);
