// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ZoneKeyboardNavProps {
  /** Management zone ids in sidebar order (used for Alt+number shortcuts). */
  zoneIds: number[];
}

/**
 * Registers Alt+number keyboard shortcuts that navigate to management zones
 * in sidebar order.
 *
 * Alt is used instead of Cmd/Ctrl or the Meta/Windows key on purpose: Cmd/Ctrl
 * +1..9 are browser tab-switch accelerators and Win+1..9 are OS taskbar
 * shortcuts — both are handled by the browser/OS before the page sees them, so
 * preventDefault has no effect there.
 *
 * @param {ZoneKeyboardNavProps} props - Ordered zone ids
 * @returns {null} - This component only attaches listeners
 */
export default function ZoneKeyboardNav({ zoneIds }: ZoneKeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      // Match the physical Digit1..Digit9 keys via event.code so the shortcut
      // is independent of keyboard layout (e.g. AZERTY, where unshifted number
      // keys emit letters, not digits).
      const match = /^Digit([1-9])$/.exec(event.code);
      if (!match) return;

      const position = Number(match[1]);
      if (position > zoneIds.length) return;

      const zoneId = zoneIds[position - 1];
      if (zoneId == null) return;

      event.preventDefault();
      router.push(`/?zone=${zoneId}`);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router, zoneIds]);

  return null;
}
