// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';
import { usePathname } from 'next/navigation';

/**
 * Renders authenticated misc routes with a header, except during `/apply` onboarding.
 *
 * @param props.children - Nested misc route content
 */
export default function MiscAuthenticatedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isApplyRoute = pathname === '/apply' || pathname.startsWith('/apply/');

  return (
    <>
      {!isApplyRoute ? <AuthenticatedHeader /> : null}
      {children}
    </>
  );
}
