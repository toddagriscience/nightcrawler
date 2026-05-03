// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';
import { Footer, NewHeader } from './components';

export const metadata: Metadata = {
  title: { default: 'Marketing', template: '%s | Todd United States' },
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
