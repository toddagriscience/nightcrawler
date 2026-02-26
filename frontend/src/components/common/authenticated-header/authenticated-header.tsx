// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';

/**
 * Header component for authenticated/platform pages
 * Displays the TODD brand and navigation links (Notifications, Account)
 * @returns {JSX.Element} - The authenticated header component
 */
export default function AuthenticatedHeader() {
  return (
    <header className="h-[4.5rem] w-full border-b" role="banner">
      <div className="mx-auto flex h-full max-w-[107rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <ToddHeader className="flex min-h-10 flex-row items-center" />
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href={'/contact'}
            className="text-foreground text-sm transition-opacity hover:opacity-70"
          >
            Contact
          </Link>
          {/** Will be added back when we actually have notifications. */}
          {/* <Link */}
          {/*   href="/notifications" */}
          {/*   className="text-foreground text-sm transition-opacity hover:opacity-70" */}
          {/* > */}
          {/*   Notifications */}
          {/* </Link> */}
          <Link
            href="/account"
            className="text-foreground text-sm transition-opacity hover:opacity-70"
          >
            Account
          </Link>
        </nav>
      </div>
    </header>
  );
}
