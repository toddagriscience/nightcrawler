// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useSyncExternalStore } from 'react';

const MIN_WIDTH = 1280;
const MEDIA_QUERY = `(min-width: ${MIN_WIDTH}px)`;

function subscribe(callback: () => void) {
  const mediaQueryList = window.matchMedia(MEDIA_QUERY);

  mediaQueryList.addEventListener('change', callback);

  return () => mediaQueryList.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(MEDIA_QUERY).matches;
}

function getServerSnapshot() {
  return true;
}

export default function DesktopGate({
  children,
}: {
  children?: React.ReactNode;
}) {
  const isAllowed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!isAllowed) {
    return (
      <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background-platform px-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-semibold">Please use a larger screen</h1>
          <p className="text-muted-foreground">
            This platform is currently optimized for desktop. Please open on a
            device at least {MIN_WIDTH}px wide.
          </p>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
}
