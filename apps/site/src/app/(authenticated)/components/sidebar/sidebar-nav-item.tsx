// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface SidebarNavItemProps {
  href: string;
  icon: ReactNode;
  children: string;
  /** Treat paths starting with href as active (e.g. /account for /account/users) */
  prefixMatch?: boolean;
}

export default function SidebarNavItem({
  href,
  icon,
  children,
  prefixMatch = false,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = prefixMatch
    ? pathname.startsWith(href)
    : pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors
        ${
          isActive
            ? 'bg-accent text-foreground font-semibold'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }
      `}
    >
      <span className="size-4 shrink-0 opacity-60" aria-hidden="true">{icon}</span>
      {children}
    </Link>
  );
}