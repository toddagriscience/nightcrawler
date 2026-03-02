// Copyright © Todd Agriscience, Inc. All rights reserved.

import { isRouteInternationalized } from '@/lib/routing';
import { NextRequest } from 'next/server';

/** A list of routes that all users need to be able to access. These should be treated as internationalized routes. See the `isAllUserRoute` function for more information. */
const allUserRoutesIntl = ['privacy', 'accessibility', 'news'];

/** Handles routes that all users need access to. An "all users" page is one that all users need to be able to access, whether authenticated or not. Due to the nature of auth routing in Nightcrawler (authenticated users are redirected away from anything localized, unauthenticated users are redirected away from anything un-localized), these routes need to be handled manually. You can find a list of these routes in the `allUserRoutes` constant. */
export default async function isAllUserRoute(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isRouteInternationalized(pathname)) {
    const unIntlRoute = pathname.split('/')[2];
    return allUserRoutesIntl.includes(unIntlRoute);
  }

  return false;
}
