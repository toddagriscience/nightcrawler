// Copyright © Todd Agriscience, Inc. All rights reserved.

export default function AuthenticatedHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen background-gradient">{children}</div>;
}
