// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { logout } from '@/lib/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const sideMenuItems = [
  { href: '/account', label: 'Farm information' },
  { href: '/account/users', label: 'User information' },
  { href: '/account/management-zones', label: 'Management zones' },
  { href: '/account/security', label: 'Security' },
  { href: '/account/privacy', label: 'Privacy' },
] as const;

export default function AccountSideMenu() {
  const pathname = usePathname().replace(/\/$/, '') || '/account';
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();

    if (!result?.error) {
      router.push('/en');
    }
  };

  return (
    <aside className="w-[180px] shrink-0 pt-2">
      <div className="border-t border-black/20 pt-4">
        <nav className="space-y-3" aria-label="Account sections">
          {sideMenuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`block text-[16px] leading-tight ${
                  isActive
                    ? 'text-foreground font-[400]'
                    : 'text-foreground font-[300] hover:opacity-70'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-24 border-t border-black/20 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="text-foreground text-[16px] leading-none font-[400] hover:cursor-pointer hover:opacity-70"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
