import { NextRequest } from 'next/server';
import applyNonce from './nonce';

function makeMockRequest(url: string): NextRequest {
  const req = {
    nextUrl: { pathname: new URL(url).pathname },
    url,
    cookies: {
      getAll: () => [],
      set: jest.fn(),
    },
  } as unknown as NextRequest;

  return req;
}

describe('applyNonce Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new NextRequest with the correct headers', () => {
    const result = applyNonce(makeMockRequest('https://google.com'));

    const newHeaders = result.headers;
    console.log(newHeaders);
    expect(newHeaders).toBeInstanceOf(Headers);
    expect(newHeaders.get('x-middleware-request-x-nonce')).toHaveLength(48);
  });

  it('should set the Content-Security-Policy request header correctly with the nonce', () => {
    const result = applyNonce(makeMockRequest('https://google.com'));

    const newHeaders = result.headers;
    const cspHeader = newHeaders.get('Content-Security-Policy');
    const expectedNonce = newHeaders.get('x-middleware-request-x-nonce');

    const expectedCsp = `default-src 'self'; script-src 'self' 'nonce-${expectedNonce}' 'strict-dynamic' https://*.posthog.com https://challenges.cloudflare.com; style-src 'self' 'nonce-${expectedNonce}' https://*.posthog.com; img-src 'self' blob: data: https://*.posthog.com; font-src 'self' https://*.posthog.com; media-src 'self' https://*.posthog.com; connect-src 'self' https://*.posthog.com https://*.supabase.co; object-src 'none'; frame-src https://challenges.cloudflare.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;`;

    expect(cspHeader).toBeDefined();
    expect(cspHeader).toContain(`'nonce-${expectedNonce}'`);
    expect(cspHeader).toBe(expectedCsp);
  });
});
