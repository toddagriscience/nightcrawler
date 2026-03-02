// Copyright © Todd Agriscience, Inc. All rights reserved.

import UnauthenticatedHeader from '@/components/common/unauthenticated-header/unauthenticated-header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Contact', template: '%s | Todd United States' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnauthenticatedHeader />
      {children}
    </>
  );
}
