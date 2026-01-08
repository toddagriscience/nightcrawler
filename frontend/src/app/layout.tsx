// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ThemeReset } from '@/components/common';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/context/theme/ThemeContext';
import { fontVariables } from '@/lib/fonts';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { PostHogProvider } from './providers';

/**
 * Root layout metadata for pages outside [locale] directory
 */
export const metadata: Metadata = {
  title: {
    default: 'Todd United States',
    template: '%s | Todd United States',
  },
};

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
            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
              <ThemeReset />
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
