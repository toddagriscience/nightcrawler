// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactNode } from 'react';
import PublicRootLayout from './public-root-layout';

vi.mock('@/lib/fonts', () => ({ fontVariables: '' }));
vi.mock('@/app/providers', () => ({
  PostHogProvider: ({ children }: { children: ReactNode }) => children,
}));
vi.mock('@/components/common', () => ({ ThemeReset: () => null }));
vi.mock('@/context/theme/theme-context', () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
}));

describe('public document language', () => {
  it.each(['en', 'es'])(
    'puts the actual %s language on server-rendered HTML',
    (locale) => {
      const html = renderToStaticMarkup(
        <PublicRootLayout locale={locale}>
          <main>Content</main>
        </PublicRootLayout>
      );
      expect(html).toContain(`<html lang="${locale}">`);
      expect(html).toContain('<main>Content</main>');
      expect(html).toContain('application/ld+json');
    }
  );
});
