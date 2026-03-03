// Copyright © Todd Agriscience, Inc. All rights reserved.

import PlatformAuthenticatedHeader from './components/platform-landing-header';

export default function AuthenticatedHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen background-gradient">
      <PlatformAuthenticatedHeader />
      {children}
    </div>
  );
}
