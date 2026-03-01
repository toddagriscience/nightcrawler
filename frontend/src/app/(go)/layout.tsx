// Copyright © Todd Agriscience, Inc. All rights reserved.

import GoFooter from '@/components/go/footer/footer';
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
            {/* Go Header */}
            <div className="flex-grow flex flex-col justify-end">
              {children}
            </div>
            <GoFooter />
          </FadeIn>
        </SmoothScroll>
      </body>
    </html>
  );
}
