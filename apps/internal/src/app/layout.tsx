// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

/**
 * Root metadata for the internal dashboard
 */
export const metadata: Metadata = {
  title: {
    default: 'Todd Internal Dashboard',
    template: '%s | Todd Internal',
  },
  description:
    'Internal advisory dashboard for Todd Agriscience advisors and executives.',
};

/**
 * Root layout for the internal dashboard application.
 * @param children - Child page content
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
