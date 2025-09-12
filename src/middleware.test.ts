// Copyright Todd LLC, All rights reserved.

/**
 * @jest-environment node
 */

// Import setup first
import './test/middleware.setup';

// Mock console.log to avoid noise in tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

// Mock next/server before importing it - need to define mock class inline to avoid hoisting issues
jest.mock('next/server', () => {
  // Create a mock response class that mimics NextResponse behavior
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
  }

  return {
    NextRequest: jest.fn(),
    NextResponse: MockNextResponse,
  };
});

// Mock next-intl/middleware to return a NextResponse
const mockIntlMiddleware = jest.fn(() => {
  const response = NextResponse.next();
  response.headers.set('x-intl-processed', '1');
  return response as NextResponse;
});

jest.mock('next-intl/middleware', () => {
  return jest.fn(() => mockIntlMiddleware);
});

// Import the types after mocking
import { NextRequest, NextResponse } from 'next/server';

// Mock the routing config
jest.mock('./i18n/config', () => ({
  routing: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localePrefix: 'always',
    localeDetection: false,
  },
}));

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('should export a function as default', async () => {
    const middlewareModule = await import('./middleware');
    expect(typeof middlewareModule.default).toBe('function');
  });

  it('should handle requests without GPC header', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const middleware = require('./middleware').default;

    // Mock NextRequest object
    const mockRequest = {
      headers: {
        get: jest.fn((header: string) => {
          if (header === 'Sec-GPC') return null;
          return null;
        }),
      },
      cookies: {
        has: jest.fn(() => false),
      },
      ip: '192.168.1.1',
    } as unknown as NextRequest;

    const result = await middleware(mockRequest);

    expect(result).toBeDefined();
    expect(result.headers).toBeDefined();
    expect(result.headers.get('x-privacy-mode')).toBe('standard');
    expect(result.headers.get('X-Privacy-Control')).toBe('standard');
    expect(mockConsoleLog).not.toHaveBeenCalledWith(
      expect.stringContaining('[GPC]')
    );
  });

  it('should handle GPC-enabled requests', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const middleware = require('./middleware').default;

    // Mock NextRequest with GPC header
    const mockRequest = {
      headers: {
        get: jest.fn((header: string) => {
          if (header === 'Sec-GPC') return '1';
          if (header === 'x-forwarded-for') return '192.168.1.1';
          return null;
        }),
      },
      cookies: {
        has: jest.fn((cookieName: string) => {
          return ['analytics', 'tracking'].includes(cookieName);
        }),
      },
      ip: '192.168.1.1',
    } as unknown as NextRequest;

    const result = await middleware(mockRequest);

    expect(result).toBeDefined();
    expect(result.headers).toBeDefined();
    expect(result.headers.get('x-gpc-detected')).toBe('1');
    expect(result.headers.get('x-privacy-mode')).toBe('strict');
    expect(result.headers.get('X-Privacy-Control')).toBe('gpc-enabled');
    expect(result.headers.get('X-Data-Processing')).toBe('minimal');
    // Note: Referrer-Policy is set in next.config.ts, not middleware

    // Should log GPC detection
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('[GPC] Privacy signal detected from 192.168.1.1')
    );
  });

  it('should remove non-essential cookies when GPC is enabled', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const middleware = require('./middleware').default;

    const mockCookiesDelete = jest.fn();
    const mockRequest = {
      headers: {
        get: jest.fn((header: string) => {
          if (header === 'Sec-GPC') return '1';
          return null;
        }),
      },
      cookies: {
        has: jest.fn((cookieName: string) => {
          return ['analytics', 'tracking', 'marketing'].includes(cookieName);
        }),
      },
      ip: '192.168.1.1',
    } as unknown as NextRequest;

    // Mock the response cookies.delete method
    mockIntlMiddleware.mockImplementationOnce(() => {
      const response = NextResponse.next();
      response.cookies.delete = mockCookiesDelete;
      return response;
    });

    await middleware(mockRequest);

    // Should delete non-essential cookies
    expect(mockCookiesDelete).toHaveBeenCalledWith('analytics');
    expect(mockCookiesDelete).toHaveBeenCalledWith('tracking');
    expect(mockCookiesDelete).toHaveBeenCalledWith('marketing');

    // Should log cookie removal
    expect(mockConsoleLog).toHaveBeenCalledWith(
      '[GPC] Removed non-essential cookie: analytics'
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      '[GPC] Removed non-essential cookie: tracking'
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      '[GPC] Removed non-essential cookie: marketing'
    );
  });

  it('should preserve essential cookies when GPC is enabled', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const middleware = require('./middleware').default;

    const mockCookiesDelete = jest.fn();
    const mockRequest = {
      headers: {
        get: jest.fn((header: string) => {
          if (header === 'Sec-GPC') return '1';
          return null;
        }),
      },
      cookies: {
        has: jest.fn((cookieName: string) => {
          return ['NEXT_LOCALE', 'theme-preference', 'analytics'].includes(
            cookieName
          );
        }),
      },
      ip: '192.168.1.1',
    } as unknown as NextRequest;

    // Mock the response cookies.delete method
    mockIntlMiddleware.mockImplementationOnce(() => {
      const response = NextResponse.next();
      response.cookies.delete = mockCookiesDelete;
      return response;
    });

    await middleware(mockRequest);

    // Should delete non-essential cookies
    expect(mockCookiesDelete).toHaveBeenCalledWith('analytics');

    // Should NOT delete essential cookies
    expect(mockCookiesDelete).not.toHaveBeenCalledWith('NEXT_LOCALE');
    expect(mockCookiesDelete).not.toHaveBeenCalledWith('theme-preference');
  });

  it('should handle basic Response from intl middleware', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const middleware = require('./middleware').default;

    // Mock intl middleware returning basic Response instead of NextResponse
    const mockBasicResponse = {
      headers: new Headers([['x-intl-basic', '1']]),
    };

    mockIntlMiddleware.mockImplementationOnce(
      () => mockBasicResponse as unknown as NextResponse
    );

    const mockRequest = {
      headers: {
        get: jest.fn(() => null),
      },
      cookies: {
        has: jest.fn(() => false),
      },
    } as unknown as NextRequest;

    const result = await middleware(mockRequest);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(NextResponse);
    expect(result.headers.get('x-intl-basic')).toBe('1');
    expect(result.headers.get('x-privacy-mode')).toBe('standard');
  });
});

describe('Middleware Config', () => {
  it('should have correct matcher configuration', async () => {
    const middlewareModule = await import('./middleware');
    const { config } = middlewareModule;

    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
    expect(config.matcher).toContain('/');
    expect(config.matcher).toContain('/(en|es)/:path*');
  });
});
