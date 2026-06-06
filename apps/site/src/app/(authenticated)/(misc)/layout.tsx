// Copyright © Todd Agriscience, Inc. All rights reserved.

import MiscAuthenticatedShell from './components/misc-authenticated-shell';

/**
 * Layout for authenticated misc routes. Hides the platform header on `/apply`.
 *
 * @param props.children - Nested misc route content
 */
export default function AuthenticatedHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MiscAuthenticatedShell>{children}</MiscAuthenticatedShell>;
}
