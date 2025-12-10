// Copyright Todd Agriscience, Inc. All rights reserved.

import { NextRequest } from 'next/server';
import { GET } from './route';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      verifyOtp: jest.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

describe('Auth Confirm Route - Open Redirect Prevention', () => {
  it('should reject external URL redirects', async () => {
    const request = new NextRequest(
      'http://localhost:3000/auth/confirm?token_hash=test&type=email&next=https://evil.com'
    );

    const response = await GET(request);
    const location = response.headers.get('location');

    // Should redirect to safe default '/' instead of external URL
    expect(location).toContain('/');
    expect(location).not.toContain('evil.com');
  });

  it('should reject protocol-relative URLs', async () => {
    const request = new NextRequest(
      'http://localhost:3000/auth/confirm?token_hash=test&type=email&next=//evil.com'
    );

    const response = await GET(request);
    const location = response.headers.get('location');

    // Should redirect to safe default '/' instead of protocol-relative URL
    expect(location).toContain('/');
    expect(location).not.toContain('//evil.com');
  });

  it('should allow valid relative paths', async () => {
    const request = new NextRequest(
      'http://localhost:3000/auth/confirm?token_hash=test&type=email&next=/account/dashboard'
    );

    const response = await GET(request);
    const location = response.headers.get('location');

    // Should allow valid relative path
    expect(location).toContain('/account/dashboard');
  });

  it('should default to root path when no next parameter provided', async () => {
    const request = new NextRequest(
      'http://localhost:3000/auth/confirm?token_hash=test&type=email'
    );

    const response = await GET(request);
    const location = response.headers.get('location');

    // Should default to '/'
    expect(location).toContain('/');
  });

  it('should reject URLs with javascript protocol', async () => {
    const request = new NextRequest(
      'http://localhost:3000/auth/confirm?token_hash=test&type=email&next=javascript:alert(1)'
    );

    const response = await GET(request);
    const location = response.headers.get('location');

    // Should reject javascript: protocol
    expect(location).toContain('/');
    expect(location).not.toContain('javascript:');
  });
});
