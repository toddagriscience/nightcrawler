// Copyright © Todd Agriscience, Inc. All rights reserved.

import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';

/**
 * Renders authenticated misc routes with the platform header (Contact, Account, etc.).
 *
 * @param props.children - Nested misc route content
 */
export default function MiscAuthenticatedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthenticatedHeader />
      {children}
    </>
  );
}
