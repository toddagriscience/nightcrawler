// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import FadeIn from './fade-in';

const { pathnameState } = vi.hoisted(() => ({
  pathnameState: { ready: false },
}));

vi.mock('next/navigation', () => ({
  // A request-time pathname previously made FadeIn replay its full fallback.
  usePathname: () => {
    if (!pathnameState.ready)
      throw new Promise<void>((resolve) =>
        setTimeout(() => {
          pathnameState.ready = true;
          resolve();
        }, 5)
      );
    return '/index/publication';
  },
}));

describe('single-copy streamed public content', () => {
  it('does not duplicate or suspend article content behind pathname animation', async () => {
    const stream = await renderToReadableStream(
      <FadeIn>
        <article>
          <h1>Publication</h1>
          <p>Primary body.</p>
        </article>
      </FadeIn>
    );
    const html = await new Response(stream).text();
    expect((html.match(/<article>/g) ?? []).length).toBe(1);
    expect((html.match(/<h1>/g) ?? []).length).toBe(1);
    expect(html).not.toContain('Primary body.</p></article></div><div hidden');
  });
});
