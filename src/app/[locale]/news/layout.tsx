// Copyright Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todd Newsroom | Press Releases and Media Resources',
  description:
    'Welcome to the Todd Newsroom, your source for the latest Todd news and corporate updates',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
