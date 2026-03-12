// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';
import ToddHeader from '../../components/common/wordmark/todd-wordmark';

/**
 * Page to handle authentication errors when logging in to the platform.
 */
export default function Error() {
  return (
    <>
      <header className="w-full" role="banner">
        <div className="mx-auto max-w-[107rem] mt-3 px-8">
          <div className="flex items-center justify-between h-13">
            <ToddHeader className="flex min-h-10 flex-row items-center" />
          </div>
        </div>
      </header>
      <div className="flex h-[calc(100vh-150px)] flex-col items-center justify-center gap-4">
        <h1 className="text-base font-thin">
          Something went wrong. Please log out and try again.
        </h1>
        <Button
          variant="outline"
          className="bg-transparent rounded-full w-[144px] text-foreground hover:bg-foreground hover:text-white"
          size="default"
          onClick={() => {
            logout();
          }}
        >
          Log out
        </Button>
      </div>
    </>
  );
}
