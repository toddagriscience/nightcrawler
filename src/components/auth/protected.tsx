// Copyright Todd Agriscience, Inc. All rights reserved.
'use client';

import { checkAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from '../ui/spinner';
import { FadeIn } from '../common';

/** A HOC for routes that require authentication. This is a form of optimistic authentication -- i.e. don't trust it with sensitive data.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child ReactNodes to be returned
 * @param {React.ReactNode} props.loadingElement - The element to display while waiting for a user to be authenticated. Default is an absolutely-positioned spinner in the center of the screen.
 * @param {string} props.redirectTo - The location to redirect to if the user fails authentication. Defaults to '/en'*/
export default function Protected({
  children,
  loadingElement,
  redirectTo = '/en',
}: {
  children: React.ReactNode;
  loadingElement?: React.ReactNode;
  redirectTo?: string;
}) {
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
    if (loadingElement != null) {
      return loadingElement;
    } else {
      return (
        <div className="relative h-screen">
          <FadeIn duration={0.2}>
            <Spinner className="absolute inset-0 m-auto w-12 h-12" />
          </FadeIn>
        </div>
      );
    }
  }

  if (isAuth === true) {
    return children;
  }

  redirect(redirectTo);
}
