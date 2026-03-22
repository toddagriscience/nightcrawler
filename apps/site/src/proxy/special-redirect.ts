// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';

/** Redirect the user for exact URLs  */
export default function specialRedirect(
  request: NextRequest
): NextResponse | null {
  const splitPath = request.nextUrl.pathname.split('/');

  if (
    splitPath.length === 4 &&
    splitPath[2] === 'careers' &&
    splitPath[3] === 'externship'
  ) {
    return NextResponse.redirect(
      // eslint-disable-next-line no-secrets/no-secrets
      'https://docs.google.com/forms/d/e/1FAIpQLSfi8yeNdjHuJCrO1sPSUhh8uCICsA6KGevRM-Mk9iND-aYkBQ/viewform'
    );
  }

  return null;
}
