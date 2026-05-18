// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { useRouter } from '@/i18n/config';
import { useLocale } from 'next-intl';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';

/**
 * Props for the `NavMenuLink` helper.
 */
export interface NavMenuLinkProps {
  /** Pathname to navigate to. Internal paths are prefixed with the active locale. */
  href: string;
  /** Optional class names forwarded to the rendered anchor. */
  className?: string;
  /** Link contents. */
  children: ReactNode;
  /** Optional callback invoked before client-side navigation. */
  onSelect?: () => void;
}

/**
 * Returns true when an href should be treated as an opaque external/hash link
 * (e.g. `#`, `mailto:`, `https://...`).
 */
function isExternalOrHash(url: string): boolean {
  return url.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(url);
}

/**
 * Navigation-menu link that performs locale-aware client-side navigation
 * without relying on the Radix `asChild` + Slot composition with `next/link`.
 *
 * That composition has a known issue in Next.js 16 + React 19 where the
 * slotted anchor can fail to materialize, breaking dropdown items and falling
 * back to full page reloads (see shadcn-ui/ui#8378). Here we render
 * `NavigationMenuLink` directly so the DOM always contains a real
 * `<a href="/{locale}/path">` (good for SEO and Cmd-click "Open in new tab"),
 * and intercept the click to push through next-intl's router for client-side
 * navigation. External links and `#` hrefs render as standard anchors.
 *
 * @param props - {@link NavMenuLinkProps}
 * @returns An accessible NavigationMenuLink wired for SPA navigation.
 */
export default function NavMenuLink({
  href,
  className,
  children,
  onSelect,
  ...rest
}: NavMenuLinkProps &
  Omit<
    ComponentProps<typeof NavigationMenuLink>,
    'href' | 'className' | 'children' | 'onClick'
  >) {
  const router = useRouter();
  const locale = useLocale();

  if (isExternalOrHash(href)) {
    return (
      <NavigationMenuLink
        href={href}
        className={className}
        onClick={onSelect}
        {...rest}
      >
        {children}
      </NavigationMenuLink>
    );
  }

  const localizedHref = `/${locale}${href.startsWith('/') ? href : `/${href}`}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Respect modifier clicks so users can still open links in a new tab.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    onSelect?.();
    router.push(href);
  };

  return (
    <NavigationMenuLink
      href={localizedHref}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </NavigationMenuLink>
  );
}
