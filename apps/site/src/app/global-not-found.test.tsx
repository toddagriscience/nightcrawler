// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import GlobalNotFound, { metadata } from './global-not-found';
import { getCspNonce } from '@/lib/get-csp-nonce';

vi.mock('@/lib/get-csp-nonce', () => ({
  getCspNonce: vi.fn(async () => 'a'.repeat(32)),
}));

vi.mock('@/lib/fonts', () => ({ fontVariables: '' }));

describe('global not-found document', () => {
  it('reads request context and contains an accessible document with final English and Spanish home links', async () => {
    const html = renderToStaticMarkup(await GlobalNotFound());
    expect(getCspNonce).toHaveBeenCalledOnce();
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<body');
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/es"');
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
