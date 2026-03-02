// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NavLinks } from '@/components/common/authenticated-header/nav-links';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';

/**
 * Header component for authenticated/platform pages
 * Displays the TODD brand and navigation links (Notifications, Account)
 * @returns {JSX.Element} - The authenticated header component
 */
export default async function PlatformAuthenticatedHeader() {
  return (
    <header className="w-full" role="banner">
      <div className="mx-auto max-w-[107rem] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <ToddHeader className="flex min-h-10 flex-row items-center" />
          <NavLinks />
        </div>
      </div>
    </header>
  );
}
