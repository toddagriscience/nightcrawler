// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { handleAuthRouting, isRouteProtected } from '@/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Mock } from 'vitest';

vitest.mock('@supabase/ssr', { spy: true });

function mockSupabase({ authenticated }: { authenticated: boolean }) {
  return {
    auth: {
      getClaims: vitest.fn().mockResolvedValue({
        data: authenticated ? { claims: { sub: '123' } } : { claims: null },
      }),
    },
  };
}

// Utility: Create a mock request with cookies support
function makeMockRequest(url: string): NextRequest {
  const req = {
    nextUrl: { pathname: new URL(url).pathname },
    url,
    cookies: {
      getAll: () => [],
      set: vitest.fn(),
    },
  } as unknown as NextRequest;

  return req;
}

describe('isRouteProtected', () => {
  describe('Root path "/" behavior', () => {
    it('should return true for exact root path "/"', () => {
      expect(isRouteProtected('/')).toBe(true);
    });

    it('should return false for paths starting with "/" but not root', () => {
      expect(isRouteProtected('/about')).toBe(false);
      expect(isRouteProtected('/contact')).toBe(false);
    });
  });

  describe('Wildcard pattern matching', () => {
    it('should return true for wildcard routes like "/account/*"', () => {
      expect(isRouteProtected('/account/settings')).toBe(true);
      expect(isRouteProtected('/account/billing/history')).toBe(true);
    });

    it('should return true for deeply nested wildcard routes', () => {
      expect(isRouteProtected('/account/something/also/this')).toBe(true);
      expect(isRouteProtected('/account/a/b/c/d/e/f')).toBe(true);
    });

    it('should return false for /account without trailing path', () => {
      // /account/* should not match /account
      expect(isRouteProtected('/account')).toBe(false);
    });

    it('should return false for similar but different paths', () => {
      // Should not match because it's not "/account/..."
      expect(isRouteProtected('/account-recovery')).toBe(false);
      expect(isRouteProtected('/accounts/settings')).toBe(false);
      expect(isRouteProtected('/myaccount/page')).toBe(false);
    });
  });

  describe('Public routes', () => {
    it('should return false for public internationalized routes', () => {
      expect(isRouteProtected('/en')).toBe(false);
      expect(isRouteProtected('/en/about')).toBe(false);
    });

    it('should return false for other public routes', () => {
      expect(isRouteProtected('/login')).toBe(false);
      expect(isRouteProtected('/public/assets')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(isRouteProtected('')).toBe(false);
    });

    it('should handle trailing slashes (Note: Next.js normalizes these before middleware)', () => {
      // These tests document expected behavior, though Next.js typically
      // handles trailing slash normalization before middleware runs
      expect(isRouteProtected('/account/settings')).toBe(true);
      expect(isRouteProtected('/account/settings/')).toBe(true);
      expect(isRouteProtected('/account/settings/profile')).toBe(true);
      expect(isRouteProtected('/account/settings/profile/')).toBe(true);
    });

    it('should handle paths with special characters', () => {
      expect(isRouteProtected('/account/user-123')).toBe(true);
      expect(isRouteProtected('/account/item_123')).toBe(true);
      expect(isRouteProtected('/account/my.file')).toBe(true);
    });

    it('should be case-sensitive', () => {
      expect(isRouteProtected('/Account/settings')).toBe(false);
      expect(isRouteProtected('/ACCOUNT/SETTINGS')).toBe(false);
    });

    it('should handle encoded characters', () => {
      expect(isRouteProtected('/account/user%20name')).toBe(true);
      expect(isRouteProtected('/account/item%2F123')).toBe(true);
    });

    it('should handle very long paths', () => {
      const longPath = '/account/' + 'segment/'.repeat(50) + 'end';
      expect(isRouteProtected(longPath)).toBe(true);
    });
  });
});

describe('handleAuthRouting', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  it('allows authenticated users on a protected route', async () => {
    const mockRequest = makeMockRequest('https://example.com/');

    (createServerClient as Mock).mockReturnValue(
      mockSupabase({ authenticated: true })
    );

    const result = await handleAuthRouting(mockRequest);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.status).toBe(200);
  });

  it('redirects authenticated users off an internationalized route to "/"', async () => {
    const mockRequest = makeMockRequest('https://example.com/en/about');

    (createServerClient as Mock).mockReturnValue(
      mockSupabase({ authenticated: true })
    );

    const result = await handleAuthRouting(mockRequest);

    expect(result?.headers.get('location')).toBe('https://example.com/');
  });

  it('redirects unauthenticated users from a protected route to "/en"', async () => {
    const mockRequest = makeMockRequest('https://example.com/');

    (createServerClient as Mock).mockReturnValue(
      mockSupabase({ authenticated: false })
    );

    const result = await handleAuthRouting(mockRequest);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('location')).toBe('https://example.com/en');
  });

  it('allows unauthenticated users on a non-protected marketing route', async () => {
    const mockRequest = makeMockRequest('https://example.com/en/who-we-are');

    (createServerClient as Mock).mockReturnValue(
      mockSupabase({ authenticated: false })
    );

    const result = await handleAuthRouting(mockRequest);

    expect(result).toBeNull();
  });

  it('redirects unauthenticated users on a non-protected unintl route', async () => {
    const mockRequest = makeMockRequest('https://example.com/who-we-are');

    (createServerClient as Mock).mockReturnValue(
      mockSupabase({ authenticated: false })
    );

    const result = await handleAuthRouting(mockRequest);

    expect(result).toBeNull();
  });

  it('does not redirect ignored routes', async () => {
    const mockRequest = makeMockRequest('https://example.com/login');

    (createServerClient as Mock).mockReturnValue(
      mockSupabase({ authenticated: false })
    );

    const result = await handleAuthRouting(mockRequest);

    expect(result).toBeNull();
  });
});
