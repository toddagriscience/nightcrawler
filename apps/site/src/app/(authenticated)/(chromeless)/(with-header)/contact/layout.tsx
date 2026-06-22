// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Todd',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
