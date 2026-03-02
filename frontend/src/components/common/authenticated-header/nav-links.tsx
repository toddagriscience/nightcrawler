// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';

/** Reusable navigation links component.
 *
 * Renders a list of navigation links in a horizontal layout.
 *
 * @param {NavLinksProps} props - The component props
 * @returns {JSX.Element} - The navigation links
 */
export async function NavLinks() {
  const user = await getAuthenticatedInfo();

  const links = [
    ...(user.approved ? [{ href: '/search', label: 'Knowledge' }] : []),
    { href: '/contact', label: 'Contact' },
    { href: '/account', label: 'Account' },
  ];

  return (
    <nav className={`flex items-center gap-6`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-foreground text-sm transition-opacity hover:opacity-70`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
