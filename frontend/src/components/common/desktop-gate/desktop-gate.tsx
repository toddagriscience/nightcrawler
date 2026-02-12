// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';

const MIN_WIDTH = 1280;

export default function DesktopGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const check = () => setIsAllowed(window.innerWidth >= MIN_WIDTH);

    check(); // run once on load
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-platform px-6">
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

  return <>{children}</>;
}
