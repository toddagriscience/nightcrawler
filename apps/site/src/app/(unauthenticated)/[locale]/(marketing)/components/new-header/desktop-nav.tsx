// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Link } from '@/i18n/config';
import { cn } from '@/lib/utils';
import DesktopMenuItem from './desktop-menu-item';
import { NavLayoutProps } from './types';

/**
 * Desktop layout for the marketing header. Hidden below the `lg` breakpoint.
 *
 * Auth links are rendered as locale-aware `Link` elements styled with
 * `buttonVariants` (rather than `Button asChild + Link`) to avoid the Radix
 * Slot + `next/link` composition issue (see shadcn-ui/ui#8378) that can cause
 * full page reloads in Next.js 16 + React 19.
 *
 * @param props - Resolved menu items and auth links to display.
 * @returns The desktop navigation row with logo, menu list, and auth buttons.
 */
export default function DesktopNav({ menuItems, authLinks }: NavLayoutProps) {
  return (
    <div className="hidden lg:block">
      <NavigationMenu>
        <div className="grid w-full grid-cols-[auto_auto_1fr] items-center px-8 py-5">
          <ToddHeader />
          <NavigationMenuList className="ml-[1rem]">
            {menuItems.map((item) => (
              <DesktopMenuItem key={item.title} item={item} />
            ))}
          </NavigationMenuList>
          <div className="flex items-center gap-5 px-5 justify-self-end">
            <Link
              href={authLinks.login.url}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'text-sm font-normal'
              )}
            >
              {authLinks.login.title}
            </Link>
            <Link
              href={authLinks.signup.url}
              className={cn(
                buttonVariants({ size: 'sm' }),
                'text-sm font-normal'
              )}
            >
              {authLinks.signup.title}
            </Link>
          </div>
        </div>
      </NavigationMenu>
    </div>
  );
}
