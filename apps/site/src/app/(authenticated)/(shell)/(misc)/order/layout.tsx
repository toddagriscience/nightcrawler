// Copyright © Todd Agriscience, Inc. All rights reserved.

import { siteConfig } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Order | Todd', template: `%s | ${siteConfig.name}` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
