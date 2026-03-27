// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Suspense } from 'react';
import { useTheme } from '@/context/theme/ThemeContext';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Inner component that accesses `usePathname()` (uncached request data)
 * and resets the theme to light mode on every navigation.
 */
function ThemeResetInner() {
  const pathname = usePathname();
  const { setIsDark } = useTheme();

  useEffect(() => {
    // Reset to light mode on route change
    setIsDark(false);
  }, [pathname, setIsDark]);

  return null;
}

/**
 * Component that resets theme to light mode on navigation.
 * Wraps the pathname-dependent logic in a Suspense boundary so
 * it does not block prerendering when `cacheComponents` is enabled.
 * This component should be placed inside the ThemeProvider.
 */
const ThemeReset: React.FC = () => (
  <Suspense>
    <ThemeResetInner />
  </Suspense>
);

export default ThemeReset;
