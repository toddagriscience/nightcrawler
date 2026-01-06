// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MenuIcon } from 'lucide-react';
import { useTheme } from '@/context/theme/ThemeContext';
import { HeaderProps } from './types/header';
import NextLink from 'next/link';
import HeaderItems from './header-items';
import { MenuItem } from '@/lib/types/components';
import { Button } from '@/components/ui';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';

/**
 * Header component
 * @param {Object} props - The component props
 * @param {boolean} props.alwaysGlassy - Whether to always show the glassy effect
 * @param {boolean} props.isDark - Whether to use the dark theme
 * @returns {JSX.Element} - The header component
 */
const Header: React.FC<HeaderProps> = ({ isDark: propIsDark }) => {
  // Only used for mobile devices (768 px or smaller)
  const [menuOpen, setMenuOpen] = useState(false);

  const { isDark: contextIsDark } = useTheme();
  const t = useTranslations('header');

  // Use prop isDark if provided, otherwise use context
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;

  const menuItems: MenuItem[] = [
    { href: '/who-we-are', label: t('navigation.whoWeAre') },
    { href: '/what-we-do', label: t('navigation.whatWeDo') },
    { href: '/news', label: t('navigation.news') },
    { href: '/careers', label: t('navigation.careers') },
  ];

  return (
    <header
      className="z-40 w-full sm:mt-4"
      data-theme={isDark ? 'dark' : 'light'}
      role="banner"
    >
      <div className="max-sm:hidden max-w-[107rem] mx-auto mt-3 px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-13">
          <ToddHeader />
          <HeaderItems menuItems={menuItems} onClickCallback={setMenuOpen} />
          <LoginLink />
        </div>
      </div>
      <div className="sm:hidden pl-5 pt-3">
        <ToddHeader />
      </div>
      <div
        className={`sm:hidden fixed bottom-0 w-screen py-2 px-6 z-20 bg-background rounded-t-md`}
      >
        <Drawer
          open={menuOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setMenuOpen(false);
            }
          }}
        >
          <DrawerContent>
            <DrawerHeader className="sr-only">
              <DrawerTitle>Navigation Menu</DrawerTitle>
            </DrawerHeader>
            <div className="mx-4 mb-4">
              <HeaderItems
                menuItems={menuItems}
                onClickCallback={setMenuOpen}
                className="flex-col items-start"
              />
            </div>
          </DrawerContent>
        </Drawer>
        <div className={`flex flex-row justify-between`}>
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="menu-toggle"
            aria-label={menuOpen ? t('menu.close') : t('menu.open')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setMenuOpen((prev) => !prev);
              }
            }}
          >
            <MenuIcon />
          </Button>
          <LoginLink />
        </div>
      </div>
    </header>
  );
};

/** Small helper for the login link.
 *
 * @returns {JSX.Element} - A link to `/login` with internationalized description text.*/
function LoginLink() {
  const t = useTranslations('header');

  return (
    <div className="flex items-center gap-4">
      <NextLink
        locale={undefined}
        href="/login"
        className="tracking-tight rounded-md p-1 text-underline transition-all duration-300 ease-in-out items-center flex cursor-pointer"
        data-testid="login-link"
      >
        {t('navigation.logIn')}
      </NextLink>
    </div>
  );
}

export default Header;
