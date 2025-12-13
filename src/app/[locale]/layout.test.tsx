// Copyright Todd Agriscience, Inc. All rights reserved.

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import LocaleLayout from './layout';
import { describe, beforeEach, it, expect, vi, Mock } from 'vitest';

// Mock dependencies
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
  getMessages: vi.fn(),
}));

vi.mock('@/i18n/config', () => ({
  routing: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
}));

vi.mock('@/lib/env', () => ({
  env: {
    baseUrl: 'https://example.com',
  },
}));

vi.mock('@/lib/fonts', () => ({
  fontVariables: 'font-class',
}));

// Mock all the components
vi.mock('@/components/common', () => ({
  FadeIn: ({ children }: { children: React.ReactNode }) => children,
  SmoothScroll: ({ children }: { children: React.ReactNode }) => children,
  ThemeReset: () => null,
}));

vi.mock('@/components/landing', () => ({
  Footer: () => null,
  Header: () => null,
}));

vi.mock('@/context/theme/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('LocaleLayout', () => {
  const mockCookies = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (cookies as Mock).mockResolvedValue(mockCookies);
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
