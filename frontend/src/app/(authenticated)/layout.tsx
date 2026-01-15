// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Layout for authenticated/platform routes
 * Applies platform background color
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The authenticated layout
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background-platform">{children}</div>;
}
