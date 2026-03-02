// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Footer, Header } from './components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Marketing', template: '%s | Todd United States' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
