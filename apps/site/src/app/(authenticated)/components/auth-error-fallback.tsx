// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Button from '@/components/common/button/button';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { logout } from '@/lib/auth-client';
import Link from 'next/link';
import { Fragment } from 'react';

/**
 * Links pinned to the bottom of the page, so a viewer blocked by an
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

const supportLinkClassName =
  'underline underline-offset-4 hover:text-foreground';

/**
 * Page to handle authentication errors when logging in to the platform.
 * @returns {JSX.Element} The authentication error page
 */
export default function AuthErrorFallback() {
  return (
    <>
      <header className="w-full" role="banner">
        <div className="mx-auto max-w-[107rem] mt-3 px-8">
          <div className="flex items-center justify-between h-13">
            <ToddHeader className="flex min-h-10 flex-row items-center" />
          </div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-64px)] flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
          <h1 className="text-sm md:text-base font-light">
            Something went wrong. Please logout and try again.
          </h1>
          <Button
            text="Logout"
            variant="outline"
            size="sm"
            showArrow={false}
            className="font-light px-8"
            onClick={() => {
              // `logout` handles its own errors and never rejects, so the
              // promise is deliberately not awaited here.
              void logout();
            }}
          />
        </div>
        <nav
          aria-label="Support links"
          className="flex flex-row flex-wrap items-center justify-center gap-3 pb-32 text-xs font-light text-foreground/70"
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
    </>
  );
}
