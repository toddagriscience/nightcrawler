// Copyright (c) Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms | Todd',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
