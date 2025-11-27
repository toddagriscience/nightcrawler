// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import { ThemeReset } from '@/components/common';
import { ThemeProvider } from '@/context/theme/ThemeContext';
import './globals.css';
import { PostHogProvider } from './providers';
import { fontVariables } from '@/lib/fonts';

/**
 * Root layout for the app
 * @param {React.ReactNode} children - The children of the root layout
 * @returns {React.ReactNode} - The root layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        <PostHogProvider>
          <ThemeProvider>
            <ThemeReset />
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
