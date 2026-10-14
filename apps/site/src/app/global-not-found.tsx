// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@/app/globals.css';
import { getCspNonce } from '@/lib/get-csp-nonce';
import english from '@/messages/common/en.json';
import spanish from '@/messages/common/es.json';
import { fontVariables } from '@/lib/fonts';
import type { Metadata } from 'next';
import Link from 'next/link';

/** Unmatched routes are never indexable and do not inherit a homepage canonical. */
export const metadata: Metadata = {
  title: 'Page not found | Todd',
  robots: { index: false, follow: true },
};

/** Complete, server-rendered document for routes outside any of the application's root layouts. */
export default async function GlobalNotFound() {
  await getCspNonce();
  return (
    <html lang="en">
      <body className={fontVariables}>
        <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-8">
          <h1 className="text-6xl font-light">404</h1>
          <p>{english.common.notFound.message}</p>
          <p lang="es">{spanish.common.notFound.message}</p>
          <nav aria-label="Return home" className="flex gap-6">
            <Link className="underline" href="/">
              Home
            </Link>
            <Link className="underline" href="/es" lang="es">
              Inicio
            </Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
