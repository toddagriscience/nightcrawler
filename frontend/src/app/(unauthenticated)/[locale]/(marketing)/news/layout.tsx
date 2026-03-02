// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'News', template: '%s | Todd United States' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
