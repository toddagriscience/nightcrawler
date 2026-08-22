// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BiHelpCircle, BiLogOut } from 'react-icons/bi';
import { NOT_SET } from '../../util';
import type { AccountSideMenuProps } from './types';

const sideMenuItems = [
  { href: '/account', label: 'Farm information' },
  { href: '/account/users', label: 'User information' },
  { href: '/account/management-zones', label: 'Management zones' },
  { href: '/account/security', label: 'Security' },
  { href: '/account/privacy', label: 'Privacy' },
] as const;

/**
 * Left-hand navigation for the account area. Leads with the farm name (the
 * account shell's only `<h1>`) and the farm's primary contact details, then
 * the account section links and the Help / Log out utility group.
 *
 * @param props.farmName - Farm display name, rendered as the shell heading
 * @param props.contactName - Primary contact's display name
 * @param props.contactEmail - Primary contact's email, linked with `mailto:`
 *   unless it is the `NOT_SET` sentinel
 * @param props.contactPhone - Primary contact's phone, linked with `tel:`
 *   unless it is the `NOT_SET` sentinel
 * @returns The account side menu aside
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
      <div className="border-t border-[#D9D9D9] pt-4 pb-6">
        <h1 className="text-foreground text-2xl leading-tight font-light break-words">
          {farmName}
        </h1>
        <div className="mt-3 space-y-1 text-sm text-foreground/70">
          <p className="break-words">{contactName}</p>
          {contactEmail === NOT_SET ? (
            <p>{contactEmail}</p>
          ) : (
            <a
              href={`mailto:${contactEmail}`}
              className="block break-all hover:text-foreground"
            >
              {contactEmail}
            </a>
          )}
          {contactPhone === NOT_SET ? (
            <p>{contactPhone}</p>
          ) : (
            <a
              href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}
              className="block hover:text-foreground"
            >
              {contactPhone}
            </a>
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

      <div className="mt-17.5 space-y-3 border-t border-[#D9D9D9] pt-4">
        <Link
          href="/contact"
          className="flex w-fit items-center gap-2 text-sm font-normal text-foreground/70 hover:text-foreground"
        >
          Help
          <BiHelpCircle className="size-5" />
        </Link>

        <Button
          type="button"
          onClick={handleLogout}
          className="text-foreground text-sm font-normal hover:cursor-pointer hover:opacity-70 translate-x-[-13px]"
        >
          Log out
          <BiLogOut className="size-5" />
        </Button>
      </div>
    </aside>
  );
}
