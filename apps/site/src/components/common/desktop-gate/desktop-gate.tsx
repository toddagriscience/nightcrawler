// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import ToddHeader from '../wordmark/todd-wordmark';

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

  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();

    if (!result?.error) {
      router.push('/en');
    }
  };

  if (!isAllowed) {
    return (
      <>
        <header
          className="w-full fixed top-0 left-0 right-0 z-[60]"
          role="banner"
        >
          <div className="mx-auto max-w-[107rem] px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <ToddHeader className="flex min-h-10 flex-row items-center" />
            </div>
          </div>
        </header>
        <div className="fixed inset-0 z-[50] flex min-h-screen flex-col items-center justify-center bg-background-platform px-6 gap-10">
          <div className="max-w-xl text-center space-y-8 border-b-1 border-[#D9D9D9] pb-10">
            <h1 className="text-3xl md:text-4xl font-thin w-[60%] sm:w-[60%] md:w-[93%] mx-auto leading-tight">
              This Page Works Best on Desktop
            </h1>
            <p className="text-base md:text-lg text-foreground font-thin w-[83%] sm:w-[70%] lg:w-[93%] mx-auto leading-tight">
              To give you the best experience, this platform is designed for
              desktop viewing. Please open it on a desktop or laptop to
              continue.
            </p>
          </div>
          <div className="max-w-xl text-center space-y-5">
            <p className="text-xs md:text-sm text-foreground/80 italic w-[60%] md:w-full mx-auto">
              Hint: If on desktop, widen your browser window to at least{' '}
              {MIN_WIDTH}px wide.
            </p>
            <p className="text-xs md:text-sm text-foreground font-thin">OR</p>
            <Button
              onClick={handleLogout}
              className="brand h-11 w-[144px] bg-foreground text-background hover:bg-foreground/90 hover:cursor-pointer rounded-full"
            >
              Log out
            </Button>
          </div>
        </div>
      </>
    );
  }

  return children ? <>{children}</> : null;
}
