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
        <PublicRootLayout locale={locale} nonce={'a'.repeat(32)}>
          <main>Content</main>
        </PublicRootLayout>
      );
      expect(html).toContain(`<html lang="${locale}">`);
      expect(html).toContain('<main>Content</main>');
      const document = new DOMParser().parseFromString(html, 'text/html');
      const scripts = document.head.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      expect(scripts).toHaveLength(2);
      expect(
        Array.from(scripts, (script) => script.getAttribute('nonce'))
      ).toEqual(['a'.repeat(32), 'a'.repeat(32)]);
      expect(
        document.body.querySelectorAll('script[type="application/ld+json"]')
      ).toHaveLength(0);
      expect(
        Array.from(
          scripts,
          (script) => JSON.parse(script.textContent ?? '{}')['@type']
        )
      ).toEqual(['WebSite', 'Organization']);
    }
  );
});
