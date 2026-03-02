// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';
import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';

export const metadata: Metadata = {
  title: { default: 'Creators', template: '%s | Todd United States' },
};

/**
 * Layout for routes in the go subdomain
 */
export default function GoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthenticatedHeader />
      {children}
    </>
  );
}
