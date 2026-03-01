// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { usePathname } from 'next/navigation';
import AuthenticatedHeader from './authenticated-header';

export default function ConditionedAuthenticatedHeader({
  approved,
}: {
  approved: boolean;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith('/account')) {
    return null;
  }

  return <AuthenticatedHeader approved={approved} />;
}
