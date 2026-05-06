// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SYSTEM_STATUS_PAGE_URL } from '../system-status-url';

/**
 * Fallback when loading the current user fails in the authenticated layout.
 *
 * @returns {JSX.Element} Recovery screen with home and system status actions
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
          Something went wrong. <br /> Please return home and try again.
        </h1>
        <p className="md:text-base text-sm text-foreground/80">
          If you continue to experience issues, please contact support.
        </p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center">
          <Button
            variant="outline"
            className="bg-foreground w-[154px] rounded-full text-background hover:bg-foreground/80 hover:text-background"
            size="default"
            asChild
          >
            <Link href="/home">Home</Link>
          </Button>
          <Button
            variant="outline"
            className="w-[154px] rounded-full"
            size="default"
            asChild
          >
            <a
              href={SYSTEM_STATUS_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Status
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
