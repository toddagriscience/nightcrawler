// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BiLogOut } from 'react-icons/bi';

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
    <aside className="w-[190px] shrink-0 mt-1">
      <div className="border-t border-[#D9D9D9] pt-4">
        <nav className="space-y-2.5" aria-label="Account sections">
          {sideMenuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`block text-sm ${
                  isActive
                    ? 'text-foreground font-bold underline'
                    : 'text-foreground/70 font-normal hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-17.5 border-t border-[#D9D9D9] pt-4">
        <Button
          type="button"
          onClick={handleLogout}
          className="text-foreground text-sm font-normal hover:cursor-pointer hover:opacity-70 translate-x-[-13px]"
        >
          <span className="text-sm font-normal">Log out</span>
          <BiLogOut className="size-5" />
        </Button>
      </div>
    </aside>
  );
}
