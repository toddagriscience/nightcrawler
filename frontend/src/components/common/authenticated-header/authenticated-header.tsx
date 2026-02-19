// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { usePathname } from 'next/navigation';

/**
 * Header component for authenticated/platform pages.
 * Hides itself on `/account` routes where the account layout provides its own navigation.
 * @returns {JSX.Element | null} - The authenticated header component, or null on account pages
 */
export default function AuthenticatedHeader() {
  const pathname = usePathname();

  // Hide the header on all /account routes
  if (pathname.startsWith('/account')) {
    return null;
  }

  return (
    <header className="w-full" role="banner">
      <div className="mx-auto max-w-[107rem] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <ToddHeader className="flex min-h-10 flex-row items-center" />
          <nav className="flex items-center gap-6">
            <Link
              href="/notifications"
              className="text-foreground text-sm transition-opacity hover:opacity-70"
            >
              Notifications
            </Link>
            <Link
              href="/account"
              className="text-foreground text-sm transition-opacity hover:opacity-70"
            >
              Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
