// Copyright Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useState } from 'react';

const COOKIE_MAX_AGE_SECONDS = 31 * 24 * 60 * 60;

/**
 * Dev auth toggle - only shows in development
 * Adds a cookie to the browser to toggle authentication status to test dashboard and proper routing
 * No tests or storybook for this component as it will be removed later
 * @returns {React.ReactNode} - The auth toggle component
 */
export function AuthToggle() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check cookie on mount
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((c) => c.trim().startsWith('isAuth='));
    setIsAuth(authCookie?.split('=')[1]?.trim() === 'true');
  }, []);

  if (process.env.NEXT_PUBLIC_DEV_TOOLS !== 'true') {
    return null;
  }

  const toggle = () => {
    const newAuth = !isAuth;
    document.cookie = `isAuth=${newAuth}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-3 rounded">
      <div className="text-xs mb-2">DEV ONLY</div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Auth: {isAuth ? '✅' : '❌'}</span>
        <button
          className="px-3 py-1 text-sm border border-white/20 rounded hover:bg-white/10 transition-colors"
          onClick={toggle}
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
