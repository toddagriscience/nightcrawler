// Copyright © Todd Agriscience, Inc. All rights reserved.

import UnauthenticatedHeader from '@/components/common/unauthenticated-header/unauthenticated-header';
import { siteConfig } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Contact', template: `%s | ${siteConfig.name}` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnauthenticatedHeader />
      {children}
    </>
  );
}
