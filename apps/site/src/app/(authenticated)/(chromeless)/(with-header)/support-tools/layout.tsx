// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Tools | Todd',
};

export default function SupportToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
