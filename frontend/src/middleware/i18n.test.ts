// Copyright © Todd Agriscience, Inc. All rights reserved.

// Import setup first
import './middleware.setup';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { NextResponse, NextRequest } from 'next/server.js';

// Dear reader: to be frank with you, I have no idea why or how this file works. Best of luck.
// Mock next-intl/middleware
vi.mock('next-intl/middleware', () => {
  const mockIntlMiddleware = vi.fn(() => {
    const response = NextResponse.next();
    response.headers.set('x-intl-processed', '1');
    return response;
  });
  return { default: mockIntlMiddleware };
});

const { MockNextResponse } = vi.hoisted(() => {
  class MockNextResponse {
    private headers = new Headers();
    private cookies: string[] = [];
    status?: number;

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
      return this.cookies;
    }

    /** test helper */
    _pushSetCookie(value: string) {
      this.cookies.push(value);
    }
  }

  const redirect = vi.fn((url: string, status = 307) => {
    const res = new MockNextResponse({}, { status });
    res.headersSet('location', url);
    return res;
  });

  const next = vi.fn(() => new MockNextResponse());

  Object.assign(MockNextResponse, {
    redirect,
    next,
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

    it('should redirect non-locale routes to /en/{path} when unauthenticated', () => {
      const mockRequest = {
        nextUrl: {
          pathname: '/who-we-are',
          clone: vi.fn().mockReturnValue({
            pathname: '/who-we-are',
          }),
        },
      } as unknown as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      // @ts-expect-error Caused by the Object.assign in MockNextResponse. See top of file for more info.
      expect(vi.mocked(MockNextResponse.redirect)).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
    });

    it('should return next() for locale routes when unauthenticated', () => {
      const mockRequest = {
        nextUrl: { pathname: '/en/about' },
      } as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      // @ts-expect-error Caused by the Object.assign in MockNextResponse. See top of file for more info.
      expect(MockNextResponse.next).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
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
