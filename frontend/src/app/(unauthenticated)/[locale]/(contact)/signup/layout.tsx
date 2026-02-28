// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Signup' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
