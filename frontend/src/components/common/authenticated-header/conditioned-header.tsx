// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { usePathname } from 'next/navigation';
import AuthenticatedHeader from './authenticated-header';

export default function ConditionedAuthenticatedHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith('/account')) {
    return null;
  }

  return <AuthenticatedHeader />;
}
