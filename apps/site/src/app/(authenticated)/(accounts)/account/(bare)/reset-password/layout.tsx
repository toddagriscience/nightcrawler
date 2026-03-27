// Copyright © Todd Agriscience, Inc. All rights reserved.

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="w-full" role="banner">
        <div className="mx-auto max-w-[107rem] mt-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <ToddHeader className="flex min-h-10 flex-row items-center" />
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
