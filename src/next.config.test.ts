// Copyright Todd Agriscience, Inc. All rights reserved.

import { beforeAll, describe, expect, it, vitest } from 'vitest';
import { NextConfig } from 'next';
import nextConfig from '../next.config';

// Mock next-intl/plugin to avoid Next.js initialization errors in tests
vitest.mock('next-intl/plugin', () => {
  return vitest.fn(() => (config: NextConfig) => config);
});

type SecurityHeader = {
  key: string;
  value: string;
};

describe('Next.js Security Headers Configuration', () => {
  let headers: SecurityHeader[];

  beforeAll(async () => {
    // Get headers configuration from next.config.ts
    const headersResult = await nextConfig.headers!();
    const globalHeaders =
      headersResult.find((route) => route.source === '/(.*)')?.headers || [];
    headers = globalHeaders as SecurityHeader[];
  });

  it('should include Strict-Transport-Security header', () => {
    const hstsHeader = headers.find(
      (h) => h.key === 'Strict-Transport-Security'
    );
    expect(hstsHeader).toBeDefined();
    expect(hstsHeader!.value).toContain('max-age=31536000');
    expect(hstsHeader!.value).toContain('includeSubDomains');
    expect(hstsHeader!.value).toContain('preload');
  });

  it('should include X-Frame-Options header', () => {
    const frameOptionsHeader = headers.find((h) => h.key === 'X-Frame-Options');
    expect(frameOptionsHeader).toBeDefined();
    expect(frameOptionsHeader!.value).toBe('SAMEORIGIN');
  });

  it('should include X-Content-Type-Options header', () => {
    const contentTypeHeader = headers.find(
      (h) => h.key === 'X-Content-Type-Options'
    );
    expect(contentTypeHeader).toBeDefined();
    expect(contentTypeHeader!.value).toBe('nosniff');
  });

  it('should include comprehensive Content-Security-Policy', () => {
    const cspHeader = headers.find((h) => h.key === 'Content-Security-Policy');
    expect(cspHeader).toBeDefined();

    const csp = cspHeader!.value;
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("font-src 'self'"); // No external font loading
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('should include comprehensive Permissions-Policy', () => {
    const permissionsHeader = headers.find(
      (h) => h.key === 'Permissions-Policy'
    );
    expect(permissionsHeader).toBeDefined();

    const policy = permissionsHeader!.value;
    expect(policy).toContain('camera=()'); // Disable camera
    expect(policy).toContain('geolocation=()'); // Disable geolocation
    expect(policy).toContain('microphone=()'); // Disable microphone
    expect(policy).toContain('interest-cohort=()'); // Disable FLoC
    expect(policy).toContain('browsing-topics=()'); // Disable Topics API
  });

  it('should include privacy-focused Referrer-Policy', () => {
    const referrerHeader = headers.find((h) => h.key === 'Referrer-Policy');
    expect(referrerHeader).toBeDefined();
    expect(referrerHeader!.value).toBe('strict-origin-when-cross-origin');
  });

  it('should include Cross-Origin headers for isolation', () => {
    const coepHeader = headers.find(
      (h) => h.key === 'Cross-Origin-Embedder-Policy'
    );
    const coopHeader = headers.find(
      (h) => h.key === 'Cross-Origin-Opener-Policy'
    );
    const corpHeader = headers.find(
      (h) => h.key === 'Cross-Origin-Resource-Policy'
    );

    expect(coepHeader).toBeDefined();
    expect(coepHeader!.value).toBe('credentialless');

    expect(coopHeader).toBeDefined();
    expect(coopHeader!.value).toBe('same-origin');

    expect(corpHeader).toBeDefined();
    expect(corpHeader!.value).toBe('same-origin');
  });

  it('should hide server information', () => {
    const serverHeader = headers.find((h) => h.key === 'Server');
    expect(serverHeader).toBeDefined();
    expect(serverHeader!.value).toBe('Todd-Server/1.0');
    expect(serverHeader!.value).not.toContain('nginx');
    expect(serverHeader!.value).not.toContain('apache');
  });

  it('should have poweredByHeader disabled', () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it('should have compression enabled', () => {
    expect(nextConfig.compress).toBe(true);
  });

  it('should include font-specific headers', async () => {
    const headersResult = await nextConfig.headers!();
    const fontHeaders =
      headersResult.find((route) => route.source === '/fonts/:path*')
        ?.headers || [];

    const cacheControlHeader = fontHeaders.find(
      (h) => h.key === 'Cache-Control'
    );
    const corpHeader = fontHeaders.find(
      (h) => h.key === 'Cross-Origin-Resource-Policy'
    );

    expect(cacheControlHeader).toBeDefined();
    expect(cacheControlHeader!.value).toContain('max-age=31536000');
    expect(cacheControlHeader!.value).toContain('immutable');

    expect(corpHeader).toBeDefined();
    expect(corpHeader!.value).toBe('same-origin');
  });
});

describe('Security Headers Compliance', () => {
  let headers: SecurityHeader[];

  beforeAll(async () => {
    const headersResult = await nextConfig.headers!();
    const globalHeaders =
      headersResult.find((route) => route.source === '/(.*)')?.headers || [];
    headers = globalHeaders as SecurityHeader[];
  });

  it('should meet OWASP security header recommendations', () => {
    const requiredHeaders = [
      'Strict-Transport-Security',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Content-Security-Policy',
      'Referrer-Policy',
    ];

    requiredHeaders.forEach((headerName) => {
      const header = headers.find((h) => h.key === headerName);
      expect(header).toBeDefined();
      expect(header!.value).toBeTruthy();
    });
  });

  it('should prevent common web vulnerabilities', () => {
    const cspHeader = headers.find((h) => h.key === 'Content-Security-Policy');
    const frameHeader = headers.find((h) => h.key === 'X-Frame-Options');
    const contentTypeHeader = headers.find(
      (h) => h.key === 'X-Content-Type-Options'
    );

    // Prevent XSS
    expect(cspHeader!.value).toContain("default-src 'self'");

    // Prevent Clickjacking
    expect(frameHeader!.value).toBe('SAMEORIGIN');

    // Prevent MIME sniffing
    expect(contentTypeHeader!.value).toBe('nosniff');
  });

  it('should enforce privacy-first policies', () => {
    const permissionsHeader = headers.find(
      (h) => h.key === 'Permissions-Policy'
    );
    const cspHeader = headers.find((h) => h.key === 'Content-Security-Policy');

    // Disable tracking APIs
    expect(permissionsHeader!.value).toContain('interest-cohort=()');
    expect(permissionsHeader!.value).toContain('browsing-topics=()');

    // Prevent external font loading (data leaks)
    expect(cspHeader!.value).toContain("font-src 'self'");
  });
});
