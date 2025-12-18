// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { handleAuthRouting } from '@/middleware/auth';
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
