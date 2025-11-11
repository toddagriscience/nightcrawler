// Copyright Todd LLC, All rights reserved.
import { AuthToggle, ThemeReset } from '@/components/common';
import { ThemeProvider } from '@/context/theme/ThemeContext';
import './globals.css';
import { checkAuthenticated } from '@/lib/auth';

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
  const isAuthenticated = await checkAuthenticated();

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
