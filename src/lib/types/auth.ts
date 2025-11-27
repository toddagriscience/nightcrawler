import { AuthError } from '@supabase/supabase-js';

export default interface LoginResponse {
  data: object;
  error: AuthError | null;
}
