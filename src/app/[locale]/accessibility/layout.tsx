// Copyright Todd LLC, All rights reserved.

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility | Todd',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
