// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Invites are sent in URL fragments, which can't be handled in the server (doesn't support PKCE). This is the solution. */
export default function AcceptInvite() {
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function helper() {
      const hash = window.location.hash.substring(1);

      if (!hash) {
        setError('No invitation details found in the URL.');
        return;
      }

      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setError('Invalid or expired invitation link.');
        return;
      }

      const { error: authError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/accept?new_user=true');
      }
    }
    helper();
  }, [supabase.auth, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h1>Authentication Error: {error}</h1>
        <button
          onClick={() => router.push('/login')}
          className="mt-2 text-sm hover:cursor-pointer underline"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl">
        Processing your invitation
        <span className="ellipsis" />
      </h1>
    </div>
  );
}
