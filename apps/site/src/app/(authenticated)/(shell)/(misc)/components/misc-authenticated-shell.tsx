// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Renders authenticated misc routes. Navigation is provided by the global
 * sidebar in the authenticated layout, so no per-route header is added here.
 *
 * @param props.children - Nested misc route content
 */
export default function MiscAuthenticatedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
