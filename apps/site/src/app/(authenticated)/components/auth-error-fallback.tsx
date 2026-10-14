// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Button from '@/components/common/button/button';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { logout } from '@/lib/auth-client';
import Link from 'next/link';
import { Fragment } from 'react';

/**
 * Support links shown below the log out action, so a viewer blocked by an
 * authentication error still has somewhere to go. The status page lives on
 * another host, so it is the only one that is not an internal route.
 */
const supportLinks = [
  { href: '/terms', label: 'Terms', isExternal: false },
  { href: '/privacy', label: 'Privacy', isExternal: false },
  {
    href: 'https://status.toddagriscience.com',
    label: 'System Status',
    isExternal: true,
  },
];

/** Shared styling for the support links below the log out action. */
const supportLinkClassName =
  'underline underline-offset-1 hover:text-foreground/70';

/**
 * Page to handle authentication errors when logging in to the platform.
 * @returns {JSX.Element} The authentication error page
 */
export default function AuthErrorFallback() {
  /**
   * Signs the viewer out. `logout()` hard-navigates the document to `/` on
   * success, so this must not route as well — a client-side push would race
   * that navigation.
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="relative min-h-dvh bg-background-platform">
      <header className="absolute inset-x-0 top-0 z-10" role="banner">
        <div className="mx-auto mt-3 h-13 max-w-[107rem] px-6 sm:px-8">
          <div className="flex h-13 items-center justify-between">
            <ToddHeader className="flex min-h-10 flex-row items-center" />
          </div>
        </div>
      </header>
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center sm:px-8">
        <div className="relative flex flex-col items-center gap-5">
          {/* Each sentence owns its own line on small screens so the copy never
              wraps mid-clause. From `sm` up the pair sits on one line, matching
              the desktop layout. The explicit space keeps the accessible name a
              single readable sentence pair. */}
          <h1 className="text-sm font-regular">
            <span className="block sm:inline">Something went wrong.</span>{' '}
            <span className="block sm:inline">
              Please logout and try again.
            </span>
          </h1>
          <Button
            text="Logout"
            variant="outline"
            size="sm"
            showArrow={false}
            className="font-regular h-[42px] w-[124px] border-[#848484] text-base"
            onClick={handleLogout}
          />
          <nav
            aria-label="Support links"
            className="absolute top-full left-1/2 mt-[255px] flex w-max max-w-[calc(100vw-3rem)] -translate-x-1/2 flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm font-regular"
          >
            {supportLinks.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 && <span aria-hidden="true">|</span>}
                {link.isExternal ? (
                  <a href={link.href} className={supportLinkClassName}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className={supportLinkClassName}>
                    {link.label}
                  </Link>
                )}
              </Fragment>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}
