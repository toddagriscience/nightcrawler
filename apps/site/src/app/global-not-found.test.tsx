// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import GlobalNotFound, { metadata } from './global-not-found';

vi.mock('@/lib/fonts', () => ({ fontVariables: '' }));

describe('global not-found document', () => {
  it('contains a complete accessible document with final English and Spanish home links', () => {
    const html = renderToStaticMarkup(<GlobalNotFound />);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<body');
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/es"');
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
