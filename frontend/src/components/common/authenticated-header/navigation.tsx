// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import Link from 'next/link';

export default async function NavLinks() {
  const user = await getAuthenticatedInfo();
  return (
    <nav className="flex items-center gap-6">
      {/** Will be added back when we actually have notifications. */}
      {/* <Link */}
      {/*   href="/notifications" */}
      {/*   className="text-foreground text-sm transition-opacity hover:opacity-70" */}
      {/* > */}
      {/*   Notifications */}
      {/* </Link> */}
      {user.approved && (
        <Link
          href="/search"
          className="text-foreground text-sm transition-opacity hover:opacity-70"
        >
          Knowledge
        </Link>
      )}
      <Link
        href={'/contact'}
        className="text-foreground text-sm transition-opacity hover:opacity-70"
      >
        Contact
      </Link>
      <Link
        href="/account"
        className="text-foreground text-sm transition-opacity hover:opacity-70"
      >
        Account
      </Link>
    </nav>
  );
}
