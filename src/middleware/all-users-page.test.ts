// Copyright Todd Agriscience, Inc. All rights reserved.

import { NextURL } from 'next/dist/server/web/next-url';
import isAllUserRoute from './all-users-page';
import { NextRequest } from 'next/server';
import { describe, it, expect } from 'vitest';

// Helper to mock NextRequest
function mockNextRequest(pathname: string): Partial<NextRequest> {
  return {
    nextUrl: { pathname } as NextURL,
  };
}

describe('isAllUserRoute', () => {
  it('returns true for /en/privacy', async () => {
    const req = mockNextRequest('/en/privacy');
    const result = await isAllUserRoute(req as NextRequest);
    expect(result).toBe(true);
  });

  it('returns true for /en/accessibility', async () => {
    const req = mockNextRequest('/en/accessibility');
    const result = await isAllUserRoute(req as NextRequest);
    expect(result).toBe(true);
  });

  it('returns false for unrelated routes', async () => {
    const req = mockNextRequest('/en/other-page');
    const result = await isAllUserRoute(req as NextRequest);
    expect(result).toBe(false);
  });

  it('returns true for localized but non-matching routes', async () => {
    const req = mockNextRequest('/es/privacy');
    const result = await isAllUserRoute(req as NextRequest);
    expect(result).toBe(true);
  });

  it('returns false for root path', async () => {
    const req = mockNextRequest('/');
    const result = await isAllUserRoute(req as NextRequest);
    expect(result).toBe(false);
  });
});
