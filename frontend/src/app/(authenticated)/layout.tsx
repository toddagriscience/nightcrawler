// Copyright © Todd Agriscience, Inc. All rights reserved.

import AuthenticatedHeader from '@/components/common/authenticated-header/authenticated-header';

/**
 * Layout for authenticated/platform routes
 * Applies platform background color and includes the authenticated header
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The authenticated layout
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-platform authenticated-root">
      <AuthenticatedHeader />
      {children}
    </div>
  );
}
