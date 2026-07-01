// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ZoneKeyboardNavProps {
  /** Management zone ids in sidebar order (used for ⌘+number shortcuts). */
  zoneIds: number[];
}

/**
 * Registers Meta+number keyboard shortcuts that navigate to management zones
 * in sidebar order.
 *
 * @param {ZoneKeyboardNavProps} props - Ordered zone ids
 * @returns {null} - This component only attaches listeners
 */
export default function ZoneKeyboardNav({ zoneIds }: ZoneKeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }

      const digit = Number.parseInt(event.key, 10);
      if (!Number.isFinite(digit) || digit < 1 || digit > zoneIds.length) {
        return;
      }

      const zoneId = zoneIds[digit - 1];
      if (zoneId == null) return;

      event.preventDefault();
      router.push(`/?zone=${zoneId}`);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router, zoneIds]);

  return null;
}
