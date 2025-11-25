// Copyright Todd Agriscience, Inc. All rights reserved.

import { handleAuthRouting } from '@/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @jest-environment node
 */

describe('handleAuthRouting', () => {
  it('should allow authenticated users on a protected un-internationalized route', () => {
    const mockRequest = {
      nextUrl: { pathname: '/dashboard' },
      url: 'https://example.com/dashboard',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, true);

    expect(result).toBeInstanceOf(NextResponse);
  });

  it('should redirect authenticated users from protected internationalized route to non-internationalized version', () => {
    const mockRequest = {
      nextUrl: { pathname: '/en/dashboard' },
      url: 'https://example.com/en/dashboard',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, true);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('location')).toBe(
      'https://example.com/dashboard'
    );
  });

  it('should redirect authenticated users from protected internationalized route with extra content behind it to non-internationalized version', () => {
    const mockRequest = {
      nextUrl: { pathname: '/en/dashboard/somewhere/extra' },
      url: 'https://example.com/en/dashboard',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, true);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('location')).toBe(
      'https://example.com/dashboard/somewhere/extra'
    );
  });

  it('should allow authenticated users on an unprotected route', () => {
    const mockRequest = {
      nextUrl: { pathname: '/about' },
      url: 'https://example.com/about',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, true);

    expect(result).toBeNull();
  });

  it('should redirect unauthenticated users from a protected un-internationalized route to /login', () => {
    const mockRequest = {
      nextUrl: { pathname: '/dashboard' },
      url: 'https://example.com/dashboard',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, false);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('location')).toBe('https://example.com/login');
  });

  it('should redirect unauthenticated users from a protected internationalized route to /login', () => {
    const mockRequest = {
      nextUrl: { pathname: '/en/dashboard' },
      url: 'https://example.com/en/dashboard',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, false);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('location')).toBe('https://example.com/login');
  });

  it('should redirect unauthenticated users from a protected internationalized route with extra content in the URL to /login', () => {
    const mockRequest = {
      nextUrl: { pathname: '/en/dashboard/somewhere/extra' },
      url: 'https://example.com/en/dashboard',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, false);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.headers.get('location')).toBe('https://example.com/login');
  });

  it('should allow unauthenticated users on an unprotected route', () => {
    const mockRequest = {
      nextUrl: { pathname: '/about' },
      url: 'https://example.com/about',
    } as NextRequest;

    const result = handleAuthRouting(mockRequest, false);

    expect(result).toBeNull();
  });
});
