// Copyright © Todd Agriscience, Inc. All rights reserved.

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import DesktopMenuItem from './desktop-menu-item';
import { NavLayoutProps } from './types';

/**
 * Desktop layout for the marketing header. Hidden below the `lg` breakpoint.
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
  );
}
