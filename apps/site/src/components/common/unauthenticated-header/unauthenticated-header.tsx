// Copyright © Todd Agriscience, Inc. All rights reserved.

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import Link from 'next/link';

/**
 * Minimalistic header component for unauthenticated pages
 * Displays the TODD brand and navigation link to support page
 * @returns {JSX.Element} - The unauthenticated header component
 */
export default function UnauthenticatedHeader() {
  return (
    <header className="w-full sm:mt-4" role="banner">
      <div className="mx-auto max-w-[107rem] mt-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13">
          <ToddHeader className="flex min-h-10 flex-row items-center" />
          <nav className="flex items-center">
            <Link
              href="/en/support"
              className="p-1 text-foreground text-base transition-opacity hover:opacity-70 tracking-tight"
            >
              Help
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
