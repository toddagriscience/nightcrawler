// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { OrderNavLink } from './components/order-nav-link';

/** Reusable navigation links component.
 *
 * Renders a list of navigation links in a horizontal layout.
 *
 * @param {NavLinksProps} props - The component props
 * @returns {JSX.Element} - The navigation links
 */
export async function NavLinks() {
  return (
    <nav className="flex items-center gap-4">
      <div className="flex items-center gap-6">
        <OrderNavLink />
        {[
          { href: '/contact', label: 'Contact' },
          { href: '/account', label: 'Account' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-foreground text-sm transition-opacity hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
