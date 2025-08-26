/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import middleware from './middleware';

// Mock next-intl/middleware
jest.mock('next-intl/middleware', () => {
  return jest.fn(() => {
    return jest.fn((req: NextRequest) => {
      // Mock response for testing
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/en${req.nextUrl.pathname}`,
        },
      });
    });
  });
});

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof middleware).toBe('function');
  });

  it('should handle requests with locale detection', async () => {
    const request = new NextRequest('http://localhost:3000/', {
      headers: {
        'accept-language': 'en-US,en;q=0.9',
      },
    });

    const response = await middleware(request);

    expect(response).toBeInstanceOf(Response);
  });

  it('should handle requests with existing locale in path', async () => {
    const request = new NextRequest('http://localhost:3000/en/about', {
      headers: {
        'accept-language': 'en-US,en;q=0.9',
      },
    });

    const response = await middleware(request);

    expect(response).toBeInstanceOf(Response);
  });

  it('should handle requests with different locale preferences', async () => {
    const request = new NextRequest('http://localhost:3000/', {
      headers: {
        'accept-language': 'de-DE,de;q=0.9,en;q=0.8',
      },
    });

    const response = await middleware(request);

    expect(response).toBeInstanceOf(Response);
  });
});

describe('Middleware Config', () => {
  it('should have correct matcher configuration', async () => {
    const middlewareModule = await import('./middleware');
    const { config } = middlewareModule;

    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
    // Updated matcher pattern excludes API routes, static assets, etc.
    expect(config.matcher).toContain(
      '/((?!api|_next/static|_next/image|favicon.ico).*)'
    );
  });
});
