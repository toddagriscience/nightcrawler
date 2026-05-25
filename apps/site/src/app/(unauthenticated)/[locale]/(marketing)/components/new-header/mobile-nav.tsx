// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { Link } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import HamburgerButton from './hamburger-button';
import MobileMenuItem from './mobile-menu-item';
import { NavLayoutProps } from './types';

/**
 * Mobile layout for the marketing header. Visible below the `lg` breakpoint
 * with a fullscreen sheet menu triggered from a fixed bottom bar.
 *
 * Auth links are rendered as locale-aware `Link` elements styled with
 * `buttonVariants` (rather than `Button asChild + Link`) to avoid the Radix
 * Slot + `next/link` composition issue (see shadcn-ui/ui#8378) that can cause
 * full page reloads in Next.js 16 + React 19.
 *
 * @param props - Resolved menu items and auth links to display.
 * @returns The mobile navigation chrome and its sheet menu.
 */
export default function MobileNav({ menuItems, authLinks }: NavLayoutProps) {
  const t = useTranslations('header');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="block lg:hidden">
      {/* Logo at top of the page */}
      <div className="relative flex px-8 py-5">
        <ToddHeader />
      </div>

      {/* Fixed bottom bar holds the hamburger trigger and the auth links */}
      <div className="fixed bottom-0 left-0 right-0 z-20 w-screen rounded-t-md bg-background px-6 py-3">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent
            side="bottom"
            className="h-3/4 w-full overflow-y-auto rounded-t-[20px] border-0 bg-background p-0 shadow-none [&>button:last-of-type]:hidden"
          >
            <SheetTitle className="sr-only">{t('menu.open')}</SheetTitle>
            <SheetDescription className="sr-only">
              {t('navigation.products')}
            </SheetDescription>
            <div className="mx-auto my-3 h-[5px] w-30 rounded-sm bg-[#000000]/90" />
            <div className="flex h-10 items-center justify-end px-4 sm:px-6">
              <HamburgerButton
                isOpen
                label={t('menu.close')}
                onClick={() => setIsMobileOpen(false)}
              />
            </div>
            <nav className="flex flex-col gap-2 px-6 pb-6 pt-2">
              {menuItems.map((item) => (
                <MobileMenuItem
                  key={item.title}
                  item={item}
                  onNavigate={() => setIsMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="flex flex-col gap-3 px-6 pb-10">
              <Link
                href={authLinks.signup.url}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'w-auto justify-start text-lg hover:opacity-70'
                )}
              >
                {authLinks.signup.title}
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-row items-center justify-between">
          <HamburgerButton
            isOpen={false}
            label={t('menu.open')}
            onClick={() => setIsMobileOpen(true)}
          />
          <Link
            href={authLinks.login.url}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'text-lg font-normal'
            )}
          >
            {authLinks.login.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
