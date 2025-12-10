// Copyright Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started',
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
