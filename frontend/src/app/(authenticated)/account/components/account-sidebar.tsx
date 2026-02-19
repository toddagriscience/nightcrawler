// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Navigation item definition for the account sidebar */
interface AccountNavItem {
  href: string;
  label: string;
}

const navItems: AccountNavItem[] = [
  {
    href: '/account',
    label: 'User Information',
  },
  {
    href: '/account/farm',
    label: 'Farm Information',
  },
  {
    href: '/account/zones',
    label: 'Zones',
  },
  {
    href: '/account/security',
    label: 'Security',
  },
  {
    href: '/account/privacy',
    label: 'Privacy',
  },
];

/**
 * Vertical sidebar navigation for the account section.
 * Displays navigation tabs for all account sub-pages and a logout button at the bottom.
 * @returns {JSX.Element} - The account sidebar navigation
 */
export default function AccountSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="flex h-full w-64 flex-col" aria-label="Account navigation">
      <div className="flex flex-1 flex-col gap-1 p-4 px-0 border-t border-border mt-12 border-black/40">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-bold'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-border p-3 px-0 border-black/40">
        <Button onClick={handleLogout} className="pl-0" variant={'ghost'}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
