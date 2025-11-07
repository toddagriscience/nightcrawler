// Copyright Todd Agriscience, Inc. All rights reserved.

'use client';

import { useTheme } from '@/context/theme/ThemeContext';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Component that resets theme to light mode on navigation
 * This component should be placed inside the ThemeProvider
 */
const ThemeReset: React.FC = () => {
  const pathname = usePathname();
  const { setIsDark } = useTheme();

  useEffect(() => {
    // Reset to light mode on route change
    setIsDark(false);
  }, [pathname, setIsDark]);

  return null;
};

export default ThemeReset;
