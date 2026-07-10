// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasCompletedPlatformOnboarding } from '@/lib/utils/platform-onboarding';
import Link from 'next/link';
import { ApplyLogoutLink } from './components/apply-logout-link';
import { OrderNavLink } from './components/order-nav-link';

/** Reusable navigation links component.
 *
 * Renders a list of navigation links in a horizontal layout.
 *
 * @param {NavLinksProps} props - The component props
 * @returns {JSX.Element} - The navigation links
 */
export async function NavLinks() {
  let onboardingComplete = false;
  try {
    const currentUser = await getAuthenticatedInfo();
    onboardingComplete = await hasCompletedPlatformOnboarding(
      currentUser.id,
      currentUser.approved
    );
  } catch {
    onboardingComplete = false;
  }

  const links = [
    { href: '/contact', label: 'Contact' },
    ...(onboardingComplete ? [{ href: '/account', label: 'Account' }] : []),
  ];

  return (
    <nav className="flex items-center gap-4">
      <div className="flex items-center gap-6">
        <OrderNavLink />
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-foreground text-sm transition-opacity hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
        <ApplyLogoutLink />
      </div>
    </nav>
  );
}
