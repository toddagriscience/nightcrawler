// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

/** sessionStorage key recording when a stale-chunk reload was last attempted. */
const CHUNK_RELOAD_KEY = 'chunk-reload-attempted';

/**
 * How long a recorded reload attempt suppresses the next one. Long enough to
 * break a reload loop when the chunk is genuinely gone, short enough that a
 * later deployment in the same browsing session still recovers on its own.
 */
const CHUNK_RELOAD_WINDOW_MS = 60_000;

/**
 * Detects the failure the browser reports when it requests a JS chunk that no
 * longer exists, which normally means a new deployment replaced it.
 * @param {Error} error - The error caught by the boundary
 * @returns {boolean} True when the error is a stale-chunk load failure
 */
function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    error.message?.includes('Loading chunk') === true
  );
}

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
  const isChunkError = isChunkLoadError(error);
  // Chunk errors are usually recoverable, so start in the recovering state
  // instead of flashing an error message we are about to reload away. The
  // effect below drops back to the error UI when a reload is not safe.
  const [isRecovering, setIsRecovering] = useState(isChunkError);

  useEffect(() => {
    if (!isChunkError) return;

    try {
      const stored = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY));
      const attemptedAt = Number.isFinite(stored) ? stored : 0;

      if (Date.now() - attemptedAt < CHUNK_RELOAD_WINDOW_MS) {
        // A reload was already attempted moments ago and did not help, so
        // reloading again would only loop. Show the error instead; the record
        // expires, which lets a later deployment recover automatically.
        logger.error('Chunk load error persisted after reloading', error);
        setIsRecovering(false);
        return;
      }

      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
    } catch {
      // Without sessionStorage there is no loop guard, so do not reload.
      logger.error('Cannot guard chunk reload; showing error UI', error);
      setIsRecovering(false);
      return;
    }

    window.location.reload();
  }, [error, isChunkError]);

  if (isRecovering) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-[90vw] max-w-[500px] flex-col items-center justify-center gap-4">
        <p role="status" aria-live="polite" className="text-muted-foreground">
          A new version is available. Reloading…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] w-[90vw] max-w-[500px] flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">There was an error with authentication</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
