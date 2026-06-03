// Copyright © Todd Agriscience, Inc. All rights reserved.

import { siteConfig } from '@/lib/metadata';
import { Metadata } from 'next';
import { Footer, NewHeader } from './components';

export const metadata: Metadata = {
  title: { default: 'Marketing', template: `%s | ${siteConfig.name}` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NewHeader />
      {children}
      <Footer />
    </>
  );
}
