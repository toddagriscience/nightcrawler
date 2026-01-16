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
    <header className="w-full" role="banner">
      <div className="max-w-[107rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <ToddHeader />
          <nav className="flex items-center gap-6">
            <Link
              href="/notifications"
              className="text-foreground text-sm hover:opacity-70 transition-opacity"
            >
              Notifications
            </Link>
            <Link
              href="/account"
              className="text-foreground text-sm hover:opacity-70 transition-opacity"
            >
              Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
