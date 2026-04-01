// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useTheme } from '@/context/theme/ThemeContext';
import { Link } from '@/i18n/config';
import { MenuItem } from '@/lib/types/components';
import { MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useState } from 'react';
import HeaderItems from './header-items';
import { HeaderProps } from './types/header';

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
      <div className="sm:hidden relative flex pl-5 pt-3">
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
  const contactLabel = t.has('navigation.contact')
    ? t('navigation.contact')
    : 'Contact';
  const actionLinkClassName =
    'group relative inline-flex items-center justify-center min-h-10 px-5 py-2 no-underline transition-colors duration-300 ease-in-out cursor-pointer hover:no-underline';
  const actionLinkBgClassName =
    'pointer-events-none absolute inset-0 rounded-[8px] bg-[#f1f1f1] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100';

  return (
    <div className="flex items-center gap-2">
      <NextLink
        locale={undefined}
        href="/login"
        className={actionLinkClassName}
        data-testid="login-link"
      >
        <span aria-hidden="true" className={actionLinkBgClassName} />
        <span className="relative z-10 tracking-tight">
          {t('navigation.logIn')}
        </span>
      </NextLink>
      <Link
        href="/contact"
        className={actionLinkClassName}
        data-testid="contact-link"
      >
        <span aria-hidden="true" className={actionLinkBgClassName} />
        <span className="relative z-10 tracking-tight">{contactLabel}</span>
      </Link>
    </div>
  );
}

export default Header;
