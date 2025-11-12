// Copyright Todd Agriscience, Inc. All rights reserved.
import { AuthToggle, ThemeReset } from '@/components/common';
import { ThemeProvider } from '@/context/theme/ThemeContext';
import { AUTH_COOKIE_NAME } from '@/middleware/auth';
import { cookies } from 'next/headers';
import './globals.css';

/**
 * Root layout for the app
 * @param {React.ReactNode} children - The children of the root layout
 * @returns {React.ReactNode} - The root layout
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  const isAuthenticated = authCookie?.value === 'true';

  // If authenticated, render html/body tags for dashboard
  if (isAuthenticated) {
    return (
      <html lang="en">
        <body>
          <ThemeProvider>
            <ThemeReset />
            {children}
            <AuthToggle />
          </ThemeProvider>
        </body>
      </html>
    );
  }

  // If not authenticated, let locale layout handle html/body
  return children;
}
