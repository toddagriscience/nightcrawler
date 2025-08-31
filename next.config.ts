// Copyright Todd LLC, All rights reserved.

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// Security headers configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline
      "style-src 'self' 'unsafe-inline'", // Allow inline styles for CSS-in-JS
      "img-src 'self' blob: data:", // Allow images from self, blob URLs, and data URLs
      "font-src 'self'", // Allow fonts from same origin
      "object-src 'none'", // Block object/embed/applet
      "base-uri 'self'", // Restrict base tag URLs
      "form-action 'self'", // Restrict form submissions
      "frame-ancestors 'none'", // Prevent embedding in frames
      'upgrade-insecure-requests', // Upgrade HTTP to HTTPS
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
