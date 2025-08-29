'use client';

import { usePathname } from '@/i18n/config';
import { useEffect } from 'react';

/**
 * Scroll to top component for smooth navigation
 * @returns {null} - The scroll to top component
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}
