// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface MenuSubItem {
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  url: string;
  /** Tagline shown next to the link list when the dropdown is open. */
  description?: string;
  items?: MenuSubItem[];
}

interface NewHeaderProps {
  className?: string;
  menu?: MenuItem[];
  auth?: {
    login: { title: string; url: string };
    signup: { title: string; url: string };
  };
}

/**
 * Marketing site header with full-width hover dropdowns and a fullscreen mobile overlay.
 * @param {NewHeaderProps} props - Optional menu items and auth links to override defaults
 * @returns {JSX.Element} - The redesigned marketing header
 */
const NewHeader = ({ menu, auth, className }: NewHeaderProps) => {
  const t = useTranslations('header');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const defaultMenu: MenuItem[] = [
    {
      title: t('navigation.research'),
      url: '#',
      //   description: t('dropdownDescription.research'),
      items: [
        { title: t('research.researchIndex.title'), url: '#' },
        { title: t('research.researchOverview.title'), url: '#' },
      ],
    },
    {
      title: t('navigation.products'),
      url: '#',
      //   description: t('dropdownDescription.products'),
      items: [{ title: t('products.iris.title'), url: '#' }],
    },
    {
      title: t('navigation.company'),
      url: '#',
      //   description: t('dropdownDescription.company'),
      items: [
        { title: t('company.about.title'), url: '/who-we-are' },
        { title: t('company.stories.title'), url: '#' },
        { title: t('company.careers.title'), url: '/careers' },
        { title: t('company.press.title'), url: '/news' },
        { title: t('company.brand.title'), url: '/brand' },
      ],
    },
    // TODO: Add foundation menu item when it is available
    { title: t('navigation.foundation'), url: '#' },
  ];

  const menuItems = menu ?? defaultMenu;
  const authLinks = auth ?? {
    login: { title: t('navigation.logIn'), url: '/login' },
    signup: { title: t('navigation.contact'), url: '/contact' },
  };

  return (
    <header className={cn('group relative w-full overflow-x-clip', className)}>
      {/* Glassy blur applied to the page behind the dropdown when a trigger is open. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-32 bottom-0 z-[5] hidden bg-foreground/5 backdrop-blur-md transition-opacity duration-200 group-has-[[data-state=open]]:block"
      />
      {/* Desktop layout */}
      <div className="hidden lg:block">
        <NavigationMenu>
          <div className="grid h-14 w-full grid-cols-[auto_auto_1fr] items-center px-4 sm:px-6 lg:px-5 lg:mx-3 lg:my-8">
            <div className="px-8">
              <ToddHeader />
            </div>
            <NavigationMenuList>
              {menuItems.map((item) => (
                <DesktopMenuItem key={item.title} item={item} />
              ))}
            </NavigationMenuList>
            <div className="flex items-center gap-5 px-5 justify-self-end">
              <Button
                className="text-sm font-normal"
                asChild
                variant="ghost"
                size="sm"
              >
                <a href={authLinks.login.url}>{authLinks.login.title}</a>
              </Button>
              <Button className="text-sm font-normal" asChild size="sm">
                <a className="text-sm font-normal" href={authLinks.signup.url}>
                  {authLinks.signup.title}
                </a>
              </Button>
            </div>
          </div>
        </NavigationMenu>
      </div>

      {/* Mobile layout */}
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
    </header>
  );
};

interface HamburgerButtonProps {
  isOpen: boolean;
  label: string;
  onClick: () => void;
}

const HamburgerButton = ({ isOpen, label, onClick }: HamburgerButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-expanded={isOpen}
    onClick={onClick}
    className="flex h-10 w-10 items-center justify-center"
  >
    <span className="sr-only">{label}</span>
    <span
      aria-hidden="true"
      className={cn(
        'absolute h-[2px] w-6 bg-current transition-transform duration-300 ease-out',
        isOpen ? 'rotate-45' : '-translate-y-[5px]'
      )}
    />
    <span
      aria-hidden="true"
      className={cn(
        'absolute h-[2px] w-6 bg-current transition-transform duration-300 ease-out',
        isOpen ? '-rotate-45' : 'translate-y-[5px]'
      )}
    />
  </button>
);

interface DesktopMenuItemProps {
  item: MenuItem;
}

const DesktopMenuItem = ({ item }: DesktopMenuItemProps) => {
  if (item.items?.length) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="rounded-none bg-transparent text-sm font-normal hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="w-full h-[11rem]">
          {/* Full-width visual panel that extends across the page behind the link list. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 -left-[100vw] -right-[100vw] -z-10 bg-background"
          />
          {/* Link list anchored to this trigger's column. */}
          <ul className="relative grid w-full grid-flow-col grid-rows-3 gap-x-10 gap-y-1 py-4 pl-4">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <a
                    href={subItem.url}
                    className="block whitespace-nowrap py-1 text-[18px] font-thin transition-opacity duration-200 hover:opacity-70"
                  >
                    {subItem.title}
                  </a>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    // desktop links without a dropdown are styled as a button with a border and padding
    <NavigationMenuItem>
      <NavigationMenuLink
        href={item.url}
        className="inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-normal transition-opacity hover:opacity-70"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

interface MobileMenuItemProps {
  item: MenuItem;
  onNavigate: () => void;
}

const MobileMenuItem = ({ item, onNavigate }: MobileMenuItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // links with a dropdown are styled as a button with a border and padding
  // and a dropdown list when the button is clicked
  if (item.items?.length) {
    return (
      <div className="border-b border-border/30 border-[#E0E0E0] py-2">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex w-full items-center gap-4 py-3 text-[22px] font-normal"
        >
          <span>{item.title}</span>
          <span
            aria-hidden="true"
            className={cn(
              'h-2 w-2 border-b border-r border-current transition-transform duration-200',
              isExpanded ? '-rotate-[135deg]' : 'rotate-45'
            )}
          />
        </button>
        {isExpanded ? (
          <ul className="flex flex-col gap-2 pb-3 pl-4">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <a
                  href={subItem.url}
                  className="block py-1 text-lg font-thin hover:opacity-70"
                  onClick={onNavigate}
                >
                  {subItem.title}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  return (
    // links without a dropdown are styled as a block with a border and padding
    <a
      href={item.url}
      className="block border-b border-[#E0E0E0] border-border/30 py-3 gap-4 text-[22px] font-normal"
      onClick={onNavigate}
    >
      {item.title}
    </a>
  );
};

export default NewHeader;
