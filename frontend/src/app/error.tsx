// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';

/**
 * Error boundary for all application pages
 * @param {object} props - Component props
 * @param {Error} props.error - The error that was thrown
 * @param {Function} props.reset - Function to retry rendering the page
 * @returns {JSX.Element} - Error UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] w-[90vw] max-w-[500px] flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">There was an error with authentication</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
