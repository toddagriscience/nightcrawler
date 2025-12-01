// Copyright (c) Todd Agriscience, Inc. All rights reserved.

import { handleAuthRouting } from '@/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @jest-environment node
 */

describe('handleAuthRouting', () => {
  it('should allow authenticated users on a protected route', () => {
    const mockRequest = {
      nextUrl: { pathname: '/' },
      url: 'https://example.com/',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, true);

    expect(result).toBeInstanceOf(NextResponse);
  });

  it('should not allow authenticated users on an internationalized route', () => {
    const mockRequest = {
      nextUrl: { pathname: '/en/about' },
      url: 'https://example.com/en/about',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, true);

    expect(result?.headers.get('location')).toBe('https://example.com/');
  });

  it('should redirect unauthenticated users from a protected route to /en', () => {
    const mockRequest = {
      nextUrl: { pathname: '/' },
      url: 'https://example.com/',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, false);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('location')).toBe('https://example.com/en');
  });

  it('should not redirect unauthenticated users navigating to a non-protected route', () => {
    const mockRequest = {
      nextUrl: { pathname: '/en/who-we-are' },
      url: 'https://example.com/en/who-we-are',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, false);

    expect(result).toBeNull();
  });
});
