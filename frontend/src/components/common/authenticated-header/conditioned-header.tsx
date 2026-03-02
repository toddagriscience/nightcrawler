// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { usePathname } from 'next/navigation';

export default function ConditionedAuthenticatedHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith('/account')) {
    return null;
  }

  return <>{children}</>;
}
