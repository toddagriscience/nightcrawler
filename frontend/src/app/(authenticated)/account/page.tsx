// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import LogoutLink from '@/components/common/utils/logout-link/logout-link';

/**
 * Account page - displays account information and logout option
 * @returns {React.ReactNode} - The account page component
 */
export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Account</h1>
        </header>
        <div className="space-y-4">
          <LogoutLink />
        </div>
      </div>
    </div>
  );
}
