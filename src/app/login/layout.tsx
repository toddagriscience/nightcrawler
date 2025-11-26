import type { Metadata } from 'next';
// Copyright Todd Agriscience, Inc. All rights reserved.

import { FadeIn, ThemeReset } from '@/components/common';
import { ThemeProvider } from '@/context/theme/ThemeContext';
import { fontVariables } from '@/lib/fonts';
import { PostHogProvider } from '../providers';

export const metadata: Metadata = { title: 'Login | Todd' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        <ThemeProvider>
          <ThemeReset />
          <FadeIn>
            <PostHogProvider>{children}</PostHogProvider>
          </FadeIn>
        </ThemeProvider>
      </body>
    </html>
  );
}
