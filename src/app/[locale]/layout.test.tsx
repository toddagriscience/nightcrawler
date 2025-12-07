// Copyright Todd Agriscience, Inc. All rights reserved.

/**
 * @jest-environment jsdom
 */

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Turnstile } from '@marsidev/react-turnstile';
import LocaleLayout from './layout';

// Mock dependencies
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
  getMessages: jest.fn(),
}));

jest.mock('@/i18n/config', () => ({
  routing: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
}));

jest.mock('@/lib/env', () => ({
  env: {
    baseUrl: 'https://example.com',
  },
}));

jest.mock('@/lib/fonts', () => ({
  fontVariables: 'font-class',
}));

// Mock all the components
jest.mock('@/components/common', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => children,
  SmoothScroll: ({ children }: { children: React.ReactNode }) => children,
  ThemeReset: () => null,
}));

jest.mock('@/components/landing', () => ({
  Footer: () => null,
  Header: () => null,
}));

jest.mock('@/context/theme/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ children }: { children: React.ReactNode }) => children,
}));

describe('LocaleLayout', () => {
  const mockCookies = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue(mockCookies);
  });

  /**
   * Test the key routing scenarios we fixed
   */
  describe('Routing Logic', () => {
    it('should call notFound() for invalid locales (authenticated users)', async () => {
      // Mock authenticated user
      mockCookies.get.mockReturnValue({ value: 'true' });

      // Invalid locale (like /invalid-page being treated as locale)
      const params = Promise.resolve({ locale: 'invalid-page' });

      try {
        await LocaleLayout({
          children: <div>Test</div>,
          params,
        });
      } catch {
        // Layout might throw due to mocked dependencies
      }

      // Should call notFound() for invalid locale
      expect(notFound).toHaveBeenCalled();
    });

    it('should call notFound() for invalid locales (unauthenticated users)', async () => {
      // Mock unauthenticated user
      mockCookies.get.mockReturnValue(undefined);

      // Invalid locale
      const params = Promise.resolve({ locale: 'invalid-locale' });

      try {
        await LocaleLayout({
          children: <div>Test</div>,
          params,
        });
      } catch {
        // Layout might throw due to mocked dependencies
      }

      // Should call notFound() for invalid locale
      expect(notFound).toHaveBeenCalled();
    });

    it('should NOT call notFound() for valid locales', async () => {
      // Mock unauthenticated user
      mockCookies.get.mockReturnValue(undefined);

      // Valid locale
      const params = Promise.resolve({ locale: 'en' });

      try {
        await LocaleLayout({
          children: <div>Test</div>,
          params,
        });
      } catch {
        // Layout might throw due to mocked dependencies, but that's ok
      }

      // Should NOT call notFound() for valid locale
      expect(notFound).not.toHaveBeenCalled();
    });

    it('should NOT call notFound() for spanish locale', async () => {
      // Mock unauthenticated user
      mockCookies.get.mockReturnValue(undefined);

      // Valid spanish locale
      const params = Promise.resolve({ locale: 'es' });

      try {
        await LocaleLayout({
          children: <div>Test</div>,
          params,
        });
      } catch {
        // Layout might throw due to mocked dependencies, but that's ok
      }

      // Should NOT call notFound() for valid locale
      expect(notFound).not.toHaveBeenCalled();
    });
  });
});
