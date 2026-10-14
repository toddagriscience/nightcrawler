// Copyright © Todd Agriscience, Inc. All rights reserved.

import { siteConfig } from '@/lib/metadata';
import { Metadata } from 'next';

/** Metadata for the private applicant setup page. */
export const metadata: Metadata = {
  title: {
    default: 'Account setup | Todd',
    template: `%s | ${siteConfig.name}`,
  },
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

/** Keeps the four steps within a single onboarding page. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
