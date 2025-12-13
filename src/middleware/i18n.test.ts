// Copyright Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';
import { ensureNextResponse, handleI18nMiddleware } from './i18n';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

// Import setup first
import './middleware.setup';

// Mock next/server with proper NextResponse class
vi.mock('next/server', () => {
  class MockNextResponse {
    private headerStore: { [key: string]: string } = {};

    headers = {
      set: vi.fn((key: string, value: string) => {
        this.headerStore[key] = value;
      }),
      get: vi.fn((key: string) => {
        return this.headerStore[key] || null;
      }),
    };
    cookies = {
      delete: vi.fn(),
    };

    static next = vi.fn(() => {
      return new MockNextResponse();
    });

    static redirect = vi.fn((url: string) => {
      const response = new MockNextResponse();
      response.headers.set('location', url);
      return response;
    });
  }

  return {
    NextRequest: vi.fn(),
    NextResponse: MockNextResponse,
  };
});

// Mock next-intl/middleware
vi.mock(import('next-intl/middleware'), async (importActual) => {
  const actual = await importActual();
  const mockIntlMiddleware = vi.fn(() => {
    const response = NextResponse.next();
    response.headers.set('x-intl-processed', '1');
    return response;
  });

  return { ...actual, mockIntlMiddleware: vi.fn(() => mockIntlMiddleware) };
});

// Mock i18n config
vi.mock('@/i18n/config', () => ({
  routing: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  SUPPORTED_LOCALES: ['en', 'es'],
}));

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

      expect(NextResponse.redirect).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NextResponse);
    });

    it('should return next() for locale routes when unauthenticated', () => {
      const mockRequest = {
        nextUrl: { pathname: '/en/about' },
      } as NextRequest;

      const result = handleI18nMiddleware(mockRequest, false);

      expect(NextResponse.next).toHaveBeenCalled();
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

      (NextResponse.next as Mock).mockReturnValue(mockNewResponse);

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

      (NextResponse.next as Mock).mockReturnValue(mockNewResponse);

      const result = ensureNextResponse(mockBasicResponse);

      expect(result).toBe(mockNewResponse);
      expect(mockNewResponse.headers.set).not.toHaveBeenCalled();
    });
  });
});
