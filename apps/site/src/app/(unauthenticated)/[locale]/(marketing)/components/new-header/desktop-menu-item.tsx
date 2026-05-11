// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { DesktopMenuItemProps } from './types';

/**
 * Renders a single top-level desktop menu entry. When the entry has children,
 * a NavigationMenu trigger reveals a full-width hover dropdown; otherwise the
 * entry is rendered as a plain navigation link.
 *
 * @param props - The menu item to render.
 * @returns A `NavigationMenuItem` with optional dropdown content.
 */
export default function DesktopMenuItem({ item }: DesktopMenuItemProps) {
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
                    className="block whitespace-nowrap py-1 text-[18px] font-normal transition-opacity duration-200 hover:opacity-70"
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
    <NavigationMenuItem>
      <NavigationMenuLink
        href={item.url}
        className="inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-normal transition-opacity hover:opacity-70"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
