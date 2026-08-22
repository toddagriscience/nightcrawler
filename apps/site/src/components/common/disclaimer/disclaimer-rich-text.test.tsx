// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * `Disclaimer` renders link tags through next-intl rich text, but the rest of the
 * suite runs against the hand-rolled `t.rich` stand-in in `vitest.setup.intl.js`.
 * That stand-in is a regex over `<tag>…</tag>`, not an ICU parser, and it wraps
 * every tag result in a keyed Fragment of its own. So it can neither prove the
 * real formatter parses these messages nor prove that returning bare JSX from a
 * tag function is safe.
 *
 * This file drops the mock for a single render to pin both:
 *  - the real ICU formatter resolves the dotted `careers.disclaimers` namespace
 *    and produces the accessible names translators wrote;
 *  - `renderLink` needs no `key`, because `use-intl`'s `prepareTranslationValues`
 *    clones each element a tag function returns with one before placing it in the
 *    chunk array. React logs a key warning through `console.error`, so an
 *    unkeyed-array regression here would fail this test.
 */

import careersEn from '@/messages/careers/en.json';
import commonEn from '@/messages/common/en.json';
import { render, screen } from '@testing-library/react';
import type * as NextIntl from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';

const MESSAGES = { ...careersEn, ...commonEn };

const LINKS = {
  inquiry: '/contact',
  coverage: 'https://example.com/pricing',
  privacy: '/privacy',
};

afterEach(() => {
  vi.doUnmock('next-intl');
  vi.resetModules();
});

describe('Disclaimer under the real next-intl formatter', () => {
  it('formats every link tag without a React key warning', async () => {
    const nextIntl = await vi.importActual<typeof NextIntl>('next-intl');
    vi.resetModules();
    vi.doMock('next-intl', () => nextIntl);
    // Dynamic on purpose: a static import binds the hoisted global mock at load
    // time, so the module has to be re-resolved after `doMock` replaces it.
    const { Disclaimer } = await import('./disclaimer');

    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <nextIntl.NextIntlClientProvider locale="en" messages={MESSAGES}>
        <Disclaimer
          translationLoc="careers.disclaimers"
          disclaimerCount={5}
          links={LINKS}
        />
      </nextIntl.NextIntlClientProvider>
    );

    const messages = consoleError.mock.calls.map((call) => String(call[0]));
    consoleError.mockRestore();

    expect(messages).toEqual([]);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(
      screen.getByRole('link', { name: 'submit an accommodation inquiry' })
    ).toHaveAttribute('href', '/contact');
    expect(
      screen.getByRole('link', { name: 'view the pricing information' })
    ).toHaveAttribute('href', 'https://example.com/pricing');
    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toHaveAttribute('href', '/privacy');
  });
});
