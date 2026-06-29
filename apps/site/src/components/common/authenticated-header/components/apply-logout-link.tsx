// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import LogoutLink from '@/components/common/utils/logout-link/logout-link';
import { usePathname } from 'next/navigation';

/**
 * only renders on the /apply route
 * @returns The apply logout link, or null outside `/apply`
 */

export function ApplyLogoutLink() {
  const pathname = usePathname();

  if (pathname !== '/apply') {
    return null;
  }

  return (
    <LogoutLink className="text-foreground flex items-center gap-1 text-sm transition-opacity hover:opacity-70" />
  );
}
