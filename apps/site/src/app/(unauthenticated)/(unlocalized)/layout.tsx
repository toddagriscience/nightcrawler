// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getCspNonce } from '@/lib/get-csp-nonce';
import PublicRootLayout from '@/components/common/public-root-layout/public-root-layout';
import { siteConfig } from '@/lib/metadata';
import type { Metadata } from 'next';

/** Defaults for public routes outside the locale segment. */
export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
};

/** English document shell for auth and onboarding entry routes. */
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = await getCspNonce();
  return <PublicRootLayout nonce={nonce}>{children}</PublicRootLayout>;
}
