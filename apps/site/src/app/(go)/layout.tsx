// Copyright © Todd Agriscience, Inc. All rights reserved.

import GoFooter from '@/app/(go)/creators/components/footer/footer';
import GoHeader from '@/app/(go)/creators/components/header/header';
import { Suspense } from 'react';
import { FadeIn, SmoothScroll } from '../../components/common';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';

/**
 * Layout for go subdomain routes
 * Applies go subdomain background color and includes the go subdomain header and footer
 * @param {React.ReactNode} children - The children of the layout
 * @returns {React.ReactNode} - The go subdomain layout
 */
export default function GoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        <SmoothScroll>
          <FadeIn className="min-h-screen flex flex-col">
            <GoHeader />
            <div className="flex-grow flex flex-col justify-end">
              {children}
            </div>
            <Suspense>
              <GoFooter />
            </Suspense>
          </FadeIn>
        </SmoothScroll>
      </body>
    </html>
  );
}
