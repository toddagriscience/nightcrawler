// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { resolveLegalRuleEndX } from './draw-legal-pages';
import { LEGAL_PAGES } from './legal-pages';

describe('LEGAL_PAGES', () => {
  it('contains the eight approved legal pages without reference audit data', () => {
    const text = LEGAL_PAGES.flatMap((page) => page.lines)
      .map((line) => line.text)
      .join('\n');
    expect(LEGAL_PAGES).toHaveLength(8);
    expect(text).toContain(
      'Confidentiality and Intellectual Property Agreement'
    );
    expect(text).toContain('Employer Signature: /s/ Vincent Todd');
    expect(text).not.toMatch(/00012345|DRHSMNTC|CAF18-PRIV/);
  });

  it('trims full-line heading rules to the rendered text width', () => {
    const page = {
      lines: [{ text: 'Heading   ', x: 43.2, top: 47.12, size: 8 }],
      rules: [],
    };
    const font = {
      widthOfTextAtSize: (text: string) => text.length * 4,
    };

    expect(
      resolveLegalRuleEndX(
        page,
        { x0: 43.2, x1: 200, top: 53.34, fitToText: true },
        font
      )
    ).toBe(71.2);
    expect(
      resolveLegalRuleEndX(page, { x0: 43.2, x1: 200, top: 53.34 }, font)
    ).toBe(200);
  });
});
