// Copyright © Todd Agriscience, Inc. All rights reserved.

// Import setup first
import './middleware.setup';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { NextResponse, NextRequest } from 'next/server.js';

// Dear reader: to be frank with you, I have no idea why or how this file works. Best of luck.
// Mock next-intl/middleware
// createMiddleware is a factory — it must return the middleware function, not be the middleware itself.
vi.mock('next-intl/middleware', () => {
  const mockIntlMiddleware = vi.fn(() => {
    const response = NextResponse.next();
    response.headers.set('x-intl-processed', '1');
    return response;
  });
  return { default: vi.fn(() => mockIntlMiddleware) };
});

const { MockNextResponse } = vi.hoisted(() => {
  class MockNextResponse {
    private headers = new Headers();
    private _rawSetCookies: string[] = [];
    private _cookieMap = new Map<string, string>();
    status?: number;

    // Mirrors the ResponseCookies interface used in Next.js middleware
    cookies = {
      set: (name: string, value: string, options?: { path?: string }) => {
        this._cookieMap.set(name, value);
        const pathStr = options?.path ? `; Path=${options.path}` : '';
        this._rawSetCookies.push(`${name}=${value}${pathStr}`);
      },
      get: (name: string) => {
        const val = this._cookieMap.get(name);
        return val !== undefined ? { name, value: val } : undefined;
      },
    };

    constructor(body?: object, init?: ResponseInit) {
      this.status = init?.status;

      if (init?.headers) {
        Object.entries(init.headers).forEach(([k, v]) => {
          this.headers.set(k, String(v));
        });
      }
    }

    static json(body: object, init?: ResponseInit) {
      return new MockNextResponse(body, init);
    }

    headersGet(name: string) {
      return this.headers.get(name);
    }

    headersSet(name: string, value: string) {
      this.headers.set(name, value);
    }

    /** required by Next middleware */
    getSetCookie(): string[] {
      return this._rawSetCookies;
    }

    /** test helper */
    _pushSetCookie(value: string) {
      this._rawSetCookies.push(value);
    }
  }

  const redirect = vi.fn((url: string, status = 307) => {
    const res = new MockNextResponse({}, { status });
    res.headersSet('location', url);
    return res;
  });

  const next = vi.fn(() => new MockNextResponse());

  const rewrite = vi.fn((url: URL | string) => {
    const res = new MockNextResponse();
    res.headersSet('x-middleware-rewrite', String(url));
    return res;
  });

  Object.assign(MockNextResponse, {
    redirect,
    next,
    rewrite,
  });

  return { MockNextResponse };
});

vi.mock('next/server', { spy: true });
vi.mock('next/server', () => ({
  NextResponse: MockNextResponse,
}));

// Mock i18n config
vi.mock('@/i18n/config', () => ({
  routing: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  SUPPORTED_LOCALES: ['en', 'es'],
}));

import { ensureNextResponse, handleI18nMiddleware } from './i18n';

describe('I18n Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleI18nMiddleware', () => {
    it('should return a response for unauthenticated public routes', () => {
      const mockRequest = {
        nextUrl: { pathname: '/en' },
      } as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
    });

    it('should return NextResponse.next() for authenticated users', () => {
      const mockRequest = {
        nextUrl: { pathname: '/en' },
      } as NextRequest;

      const result = handleI18nMiddleware(mockRequest, true);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
    });

    it('should delegate to intl middleware for default locale (en) unprefixed paths', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/about',
          clone: vi.fn().mockReturnValue({ pathname: '/about' }),
        },
        cookies: { get: vi.fn().mockReturnValue(undefined) },
        headers: { get: vi.fn().mockReturnValue(null) },
      } as unknown as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
      expect(result.headers.get('x-intl-processed')).toBe('1');
    });

    it('should not redirect unauth uninternationalized routes', async () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/auth',
          clone: vi.fn().mockReturnValue({
            pathname: '/auth',
          }),
        },
      } as unknown as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      // @ts-expect-error Caused by the Object.assign in MockNextResponse. See top of file for more info.
      expect(vi.mocked(MockNextResponse.next)).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
      expect(result.headers.get('testing-location')).toBe('/auth');
    });

    it('should redirect unauth internationalized routes', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/es/auth',
        nextUrl: {
          pathname: '/es/auth',
          clone: vi.fn().mockReturnValue({
            pathname: '/es/auth',
          }),
        },
      } as unknown as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      // @ts-expect-error Caused by the Object.assign in MockNextResponse. See top of file for more info.
      expect(vi.mocked(MockNextResponse.redirect)).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
      // @ts-expect-error Caused for some reason, probably due to the mock
      expect(result.headers.get('location').pathname).toBe('/auth');
    });

    it('should delegate to intl middleware for locale-prefixed routes when unauthenticated', () => {
      const mockRequest = {
        nextUrl: { pathname: '/en/about' },
      } as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
      expect(result.headers.get('x-intl-processed')).toBe('1');
    });

    it('should set NEXT_LOCALE=en cookie on /en/* redirect to prevent Accept-Language override', () => {
      const mockRequest = {
        nextUrl: { pathname: '/en/about' },
      } as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      // @ts-expect-error getSetCookie is a mock-only method not on NextResponse
      const setCookies: string[] = result.getSetCookie();
      expect(setCookies.some((c) => c.startsWith('NEXT_LOCALE=en'))).toBe(true);
    });

    it('should not set NEXT_LOCALE cookie for non-default locale paths like /es/*', () => {
      const mockRequest = {
        nextUrl: { pathname: '/es/about' },
      } as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      // @ts-expect-error getSetCookie is a mock-only method not on NextResponse
      const setCookies: string[] = result.getSetCookie();
      expect(setCookies.every((c) => !c.startsWith('NEXT_LOCALE='))).toBe(true);
    });
  });

  describe('ensureNextResponse', () => {
    it('should return NextResponse as-is when input is NextResponse', () => {
      const mockNextResponse = NextResponse.next();
      const result = ensureNextResponse(mockNextResponse);

      expect(result).toBe(mockNextResponse);
    });

    it('should create NextResponse and copy headers when input is basic Response', () => {
      const mockBasicResponse = {
        headers: new Map([
          ['x-test-header', 'test-value'],
          ['x-another-header', 'another-value'],
        ]),
      } as unknown as Response;

      // Mock the headers.forEach method
      mockBasicResponse.headers.forEach = vi.fn((callback) => {
        callback('test-value', 'x-test-header', mockBasicResponse.headers);
        callback(
          'another-value',
          'x-another-header',
          mockBasicResponse.headers
        );
      });

      const mockNewResponse = {
        headers: {
          set: vi.fn(),
        },
      } as unknown as NextResponse;

      // @ts-expect-error Caused by the Object.assign in MockNextResponse. See top of file for more info.
      MockNextResponse.next.mockReturnValue(mockNewResponse);

      const result = ensureNextResponse(mockBasicResponse);

      expect(result).toBe(mockNewResponse);
      expect(mockNewResponse.headers.set).toHaveBeenCalledWith(
        'x-test-header',
        'test-value'
      );
      expect(mockNewResponse.headers.set).toHaveBeenCalledWith(
        'x-another-header',
        'another-value'
      );
    });

    it('should handle Response without headers gracefully', () => {
      const mockBasicResponse = {} as Response;
      const mockNewResponse = {
        headers: {
          set: vi.fn(),
        },
      } as unknown as NextResponse;

      // @ts-expect-error Caused by the Object.assign in MockNextResponse. See top of file for more info.
      MockNextResponse.next.mockReturnValue(mockNewResponse);

      const result = ensureNextResponse(mockBasicResponse);

      expect(result).toBe(mockNewResponse);
      expect(mockNewResponse.headers.set).not.toHaveBeenCalled();
    });
  });
});
