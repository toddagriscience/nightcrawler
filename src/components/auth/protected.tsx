// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import { checkAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Protected({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    async function updateAuth() {
      const isAuthenticated = await checkAuthenticated();
      setIsAuth(isAuthenticated);
      setIsBusy(false);
    }
    updateAuth();
  }, [setIsAuth, setIsBusy]);

  if (isBusy) {
    return <p>Loading</p>;
  }

  if (isAuth === true) {
    return children;
  }

  redirect('login');
}
