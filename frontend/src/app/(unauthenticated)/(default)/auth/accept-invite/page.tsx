// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import dynamic from 'next/dynamic';

const AcceptInvite = dynamic(() => import('./components/accept-invite'), {
  ssr: false,
});

/** Invites are sent in URL fragments, which can't be handled in the server (doesn't support PKCE). This is the solution. */
export default function Page() {
  return <AcceptInvite />;
}
