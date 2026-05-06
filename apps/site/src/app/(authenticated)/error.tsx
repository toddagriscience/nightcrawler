// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import ToddHeader from '../../components/common/wordmark/todd-wordmark';
import Link from 'next/link';

/**
 * Error UI for authenticated routes when rendering fails.
 *
 * @returns {JSX.Element} Recovery screen with a link back to home
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
      <div className="flex h-[calc(100vh-150px)] flex-col items-center text-center justify-center gap-10">
        <h1 className="md:text-3xl text-2xl font-thin">
          Something went wrong. <br /> Please return home and try again.
        </h1>
        <p className="md:text-base text-sm text-foreground/80">
          If you continue to experience issues, please contact support.
        </p>
        <Button
          variant="outline"
          className="bg-foreground rounded-full w-[154px] text-background hover:bg-foreground/80 hover:text-background"
          size="default"
          asChild
        >
          <Link href="/home">Home</Link>
        </Button>
      </div>
    </>
  );
}
