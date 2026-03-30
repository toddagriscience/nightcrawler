// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';

/**
 * Page to handle authentication errors when logging in to the platform.
 */
export default function AuthErrorFallback() {
  return (
    <>
      <header className="w-full" role="banner">
        <div className="mx-auto max-w-[107rem] mt-3 px-8">
          <div className="flex items-center justify-between h-13">
            <ToddHeader className="flex min-h-10 flex-row items-center" />
          </div>
        </div>
      </header>
      <div className="flex h-[calc(100vh-150px)] flex-col items-center text-center justify-center gap-10">
        <h1 className="md:text-3xl text-2xl font-thin">
          Something went wrong. <br /> Please log out and try again.
        </h1>
        <p className="md:text-base text-sm text-foreground/80">
          If you continue to experience issues, please contact support.
        </p>
        <div className="flex gap-4 md:flex-row flex-col mt-4">
          <Button
            variant="outline"
            className="bg-foreground rounded-full w-[154px] text-background hover:bg-foreground/80 hover:text-background"
            size="default"
            onClick={() => {
              logout();
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </>
  );
}
