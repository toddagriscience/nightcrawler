// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useSyncExternalStore } from 'react';
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
 * When this document started.
 *
 * The guard compares against page-load time rather than a live `Date.now()`
 * so {@link canAttemptReload} stays a pure function of what is in storage.
 * React may call a `useSyncExternalStore` snapshot more than once per render
 * and requires the same answer each time; a live clock could flip the
 * comparison at the window boundary.
 */
const PAGE_LOADED_AT = Date.now();

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
 * The guard only changes by reloading the document, so there is nothing to
 * subscribe to. The unsubscribe is a no-op.
 * @returns {Function} A no-op unsubscribe
 */
function subscribeToReloadGuard() {
  return () => {};
}

/**
 * Whether reloading is still safe, read at render time from the attempt this
 * page load may have recorded. A recent attempt means the reload did not help,
 * so reloading again would only loop. Unreadable storage counts as unsafe:
 * without the guard there is nothing to stop that loop.
 * @returns {boolean} True when a reload has not been attempted recently
 */
function canAttemptReload(): boolean {
  try {
    const stored = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY));
    const attemptedAt = Number.isFinite(stored) ? stored : 0;

    return PAGE_LOADED_AT - attemptedAt >= CHUNK_RELOAD_WINDOW_MS;
  } catch {
    return false;
  }
}

/**
 * Server render has no sessionStorage and cannot reload a document, so the
 * error UI is the only honest answer there.
 * @returns {boolean} Always false
 */
function cannotAttemptReloadDuringSsr(): boolean {
  return false;
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
  // Derived, not stored: the reload guard is read during render, so the
  // recovery UI never has to be corrected afterwards by a setState.
  const canReload = useSyncExternalStore(
    subscribeToReloadGuard,
    canAttemptReload,
    cannotAttemptReloadDuringSsr
  );
  const isRecovering = isChunkError && canReload;

  useEffect(() => {
    if (!isChunkError) return;

    if (!isRecovering) {
      // Either a reload was already attempted moments ago and did not help, or
      // storage is unreadable so there is no loop guard. Both mean showing the
      // error instead; the record expires, which lets a later deployment
      // recover on its own.
      logger.error('Not reloading for chunk error; showing error UI', error);
      return;
    }

    try {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
    } catch {
      // Recording failed, so a reload would be unguarded. Do not reload.
      logger.error('Cannot record chunk reload attempt', error);
      return;
    }

    window.location.reload();
  }, [error, isChunkError, isRecovering]);

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
