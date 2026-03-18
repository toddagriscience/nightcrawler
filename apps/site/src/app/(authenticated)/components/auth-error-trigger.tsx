// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import AuthErrorPage from '@/app/(authenticated)/error';
import { useSearchParams } from 'next/navigation';

/**
 * Throws a debug error when `authError=1` is present in dev for testing.
 * @returns {JSX.Element | null} - Null when not triggered
 */
export default function AuthErrorTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  if (
    process.env.NODE_ENV !== 'production' &&
    searchParams?.get('authError') === '1'
  ) {
    return <AuthErrorPage />;
  }

  return <>{children}</>;
}
