// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: {
    default: 'Account | Todd',
    template: '%s | Todd',
  },
};

function AccountLayoutFallback() {
  return (
    <div className="max-w-[568px]">
      <Skeleton className="h-6 w-48 mb-6 bg-foreground/10" />
      <Skeleton className="h-40 w-full bg-foreground/10" />
    </div>
  );
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<AccountLayoutFallback />}>{children}</Suspense>;
}
