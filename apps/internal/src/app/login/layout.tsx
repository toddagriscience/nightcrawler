// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';

/**
 * Login page metadata
 */
export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to the Todd Internal Dashboard.',
};

/**
 * Login layout - no sidebar, centered content.
 * @param children - Login page content
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {children}
    </div>
  );
}
