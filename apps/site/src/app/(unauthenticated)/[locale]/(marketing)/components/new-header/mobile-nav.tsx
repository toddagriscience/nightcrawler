// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import HamburgerButton from './hamburger-button';
import MobileMenuItem from './mobile-menu-item';
import { NavLayoutProps } from './types';

/**
 * Mobile layout for the marketing header. Visible below the `lg` breakpoint
 * with a fullscreen sheet menu triggered from a fixed bottom bar.
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
      <div className="relative flex pl-5 pt-3">
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
              <Button
                className="w-auto justify-start text-lg hover:opacity-70"
                asChild
                variant="ghost"
              >
                <a
                  href={authLinks.signup.url}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {authLinks.signup.title}
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-row items-center justify-between">
          <HamburgerButton
            isOpen={false}
            label={t('menu.open')}
            onClick={() => setIsMobileOpen(true)}
          />
          <Button
            className="text-lg font-normal"
            asChild
            variant="ghost"
            size="sm"
          >
            <a href={authLinks.login.url}>{authLinks.login.title}</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
