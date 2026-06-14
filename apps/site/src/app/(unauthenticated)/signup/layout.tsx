// Copyright © Todd Agriscience, Inc. All rights reserved.

import UnauthenticatedHeader from '@/components/common/unauthenticated-header/unauthenticated-header';
import { siteConfig } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Signup', template: `%s | ${siteConfig.name}` },
};

/** Layout for the approved-applicant password signup step (non-internationalized). */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnauthenticatedHeader />
      {children}
    </>
  );
}
