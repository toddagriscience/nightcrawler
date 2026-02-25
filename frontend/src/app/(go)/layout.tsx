// Copyright © Todd Agriscience, Inc. All rights reserved.

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
          <FadeIn>
            {/* Go Header */}
            {children}
            {/* Go Footer */}
          </FadeIn>
        </SmoothScroll>
      </body>
    </html>
  );
}
