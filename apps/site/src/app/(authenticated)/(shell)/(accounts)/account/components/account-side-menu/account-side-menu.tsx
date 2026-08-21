// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BiArrowBack, BiLogOut } from 'react-icons/bi';
import type { AccountSideMenuProps } from './types';

/** Sentinel returned by the account queries when a field has no stored value. */
const NOT_SET = 'Not set';

const sideMenuItems = [
  { href: '/account', label: 'Farm information' },
  { href: '/account/users', label: 'User information' },
  { href: '/account/management-zones', label: 'Management zones' },
  { href: '/account/security', label: 'Security' },
  { href: '/account/privacy', label: 'Privacy' },
] as const;

/**
 * Left-hand navigation for the account area, showing the current farm and its
 * primary contact above the section links.
 *
 * Also owns the route out of the account area. `AccountHeader` used to provide
 * the wordmark and a Home link, and no layout above `account/(with-shell)`
 * renders any chrome, so without this the account pages have no way back.
 *
 * @param props.farmName - Display name for the farm
 * @param props.contactName - Display name for the primary contact
 * @param props.contactEmail - Email for the primary contact
 * @param props.contactPhone - Phone number for the primary contact
 * @returns The account side menu
 */
export default function AccountSideMenu({
  farmName,
  contactName,
  contactEmail,
  contactPhone,
}: AccountSideMenuProps) {
  const pathname = usePathname().replace(/\/$/, '') || '/account';
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();

    if (!result?.error) {
      router.push('/');
    }
  };

  return (
    <aside className="w-[190px] shrink-0 mt-1">
      <Link
        href="/"
        className="text-foreground mb-6 inline-flex items-center gap-2 text-sm hover:opacity-70"
      >
        <BiArrowBack className="size-4" />
        Home
      </Link>

      {/* Current farm and primary contact, moved here from AccountHeader. */}
      <div className="mb-6 border-t border-[#D9D9D9] pt-4">
        <h1 className="text-foreground text-lg font-normal">{farmName}</h1>
        <div className="mt-3 space-y-1 text-sm text-foreground/70">
          <p>{contactName}</p>
          {contactEmail && contactEmail !== NOT_SET ? (
            <p>
              <a href={`mailto:${contactEmail}`} className="hover:underline">
                {contactEmail}
              </a>
            </p>
          ) : (
            <p>{contactEmail}</p>
          )}
          {contactPhone && contactPhone !== NOT_SET ? (
            <p>
              <a
                href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                className="hover:underline"
              >
                {contactPhone}
              </a>
            </p>
          ) : (
            <p>{contactPhone}</p>
          )}
        </div>
      </div>

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
