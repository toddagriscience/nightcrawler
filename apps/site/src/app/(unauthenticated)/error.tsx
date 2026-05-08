// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
import { routing } from '@/i18n/config';
import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Error boundary UI for public (unauthenticated) routes when rendering fails.
 *
 * @param {object} props - Component props
 * @param {Error} props.error - The error that was thrown
 * @param {Function} props.reset - Retries rendering the failed segment
 * @returns {JSX.Element} - Public error UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('[unauthenticated] route error boundary', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  const supportPath = `/${routing.defaultLocale}/support`;

  return (
    <>
      <header className="w-full" role="banner">
        <div className="mx-auto mt-3 max-w-[107rem] px-8">
          <div className="flex h-13 items-center justify-between">
            <ToddHeader className="flex min-h-10 flex-row items-center" />
          </div>
        </div>
      </header>
      <div className="flex h-[calc(100vh-150px)] flex-col items-center justify-center gap-10 text-center">
        <h1 className="text-2xl font-thin md:text-3xl">
          Something went wrong. <br /> Please try again.
        </h1>
        <p className="text-sm text-foreground/80 md:text-base">
          If you continue to experience issues, visit our support page or return
          to the homepage.
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Button
            type="button"
            variant="outline"
            className="bg-foreground w-[154px] rounded-full text-background hover:bg-foreground/80 hover:text-background"
            size="default"
            onClick={() => {
              reset();
            }}
          >
            Try again
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-[154px] rounded-full"
            size="default"
            asChild
          >
            <Link href={supportPath}>Support</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
