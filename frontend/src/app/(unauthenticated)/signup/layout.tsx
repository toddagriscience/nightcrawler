// Copyright © Todd Agriscience, Inc. All rights reserved.

import UnauthenticatedHeader from '@/components/common/unauthenticated-header/unauthenticated-header';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Signup' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnauthenticatedHeader />
      {children}
    </>
  );
}
