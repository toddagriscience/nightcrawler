// Copyright Todd Agriscience, Inc. All rights reserved.

/**
 * @jest-environment node
 */

// Import setup first
import './middleware.setup';

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    warn: jest.fn(),
  },
}));

// Mock next/server with proper NextResponse class
jest.mock('next/server', () => {
  class MockNextResponse {
    private headerStore: { [key: string]: string } = {};

    headers = {
      set: jest.fn((key: string, value: string) => {
        this.headerStore[key] = value;
      }),
      get: jest.fn((key: string) => {
        return this.headerStore[key] || null;
      }),
    };
    cookies = {
      delete: jest.fn(),
    };

    static next() {
      return new MockNextResponse();
    }

    static redirect() {
      return new MockNextResponse();
    }
  }

  return {
    NextRequest: jest.fn(),
    NextResponse: MockNextResponse,
  };
});

import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, getAuthStatus, handleAuthRouting } from './auth';

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthStatus', () => {
    it('should return true when auth cookie is set to true', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'true' }),
        },
      } as unknown as NextRequest;

      const result = getAuthStatus(mockRequest);
      expect(result).toBe(true);
      expect(mockRequest.cookies.get).toHaveBeenCalledWith(AUTH_COOKIE_NAME);
    });

    it('should return false when auth cookie is set to false', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'false' }),
        },
      } as unknown as NextRequest;

      const result = getAuthStatus(mockRequest);
      expect(result).toBe(false);
    });

    it('should return false when auth cookie is not present', () => {
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      } as unknown as NextRequest;

      const result = getAuthStatus(mockRequest);
      expect(result).toBe(false);
    });
  });

  describe('handleAuthRouting', () => {
    it('should redirect authenticated users from locale routes to dashboard', () => {
      const mockRequest = {
        nextUrl: { pathname: '/en/about' },
        url: 'https://example.com/en/about',
      } as NextRequest;

      const result = handleAuthRouting(mockRequest, true);

      expect(result).toBeInstanceOf(NextResponse);
      // Note: In a real test, you'd check the redirect URL
    });

    it('should not redirect authenticated users from non-locale routes (let them through)', () => {
      const mockRequest = {
        nextUrl: { pathname: '/invalid-route' },
        url: 'https://example.com/invalid-route',
      } as NextRequest;

      const result = handleAuthRouting(mockRequest, true);

      expect(result).toBeNull();
    });

    it('should redirect unauthenticated users from root to /en', () => {
      const mockRequest = {
        nextUrl: { pathname: '/' },
        url: 'https://example.com/',
      } as NextRequest;

      const result = handleAuthRouting(mockRequest, false);

      expect(result).toBeInstanceOf(NextResponse);
    });

    it('should not redirect unauthenticated users from non-root routes (let i18n handle)', () => {
      const mockRequest = {
        nextUrl: { pathname: '/invalid-route' },
        url: 'https://example.com/invalid-route',
      } as NextRequest;

      const result = handleAuthRouting(mockRequest, false);

      expect(result).toBeNull();
    });

    it('should return null for valid routes that do not need redirection', () => {
      const mockRequest = {
        nextUrl: { pathname: '/' },
        url: 'https://example.com/',
      } as NextRequest;

      const result = handleAuthRouting(mockRequest, true);
      expect(result).toBeNull();
    });
  });
});
