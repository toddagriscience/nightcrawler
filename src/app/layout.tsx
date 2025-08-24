import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { fontVariables } from '@/lib/fonts';
import { Cursor, Header, Footer, SmoothScroll } from '@/components/ui';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Todd Agriscience',
  description: 'Todd Agriscience - Leading agricultural science and innovation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontVariables} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll>
          <Cursor />
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
