// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { isOutboundHref, toSafeHref } from './safe-href';

describe('toSafeHref', () => {
  it('returns null for empty/missing values', () => {
    expect(toSafeHref(null)).toBeNull();
    expect(toSafeHref(undefined)).toBeNull();
    expect(toSafeHref('')).toBeNull();
    expect(toSafeHref('   ')).toBeNull();
  });

  it('blocks dangerous schemes', () => {
    expect(toSafeHref('javascript:alert(1)')).toBeNull();
    // Scheme casing/whitespace must not slip past.
    expect(toSafeHref('  JavaScript:alert(1)')).toBeNull();
    expect(toSafeHref('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(toSafeHref('vbscript:msgbox(1)')).toBeNull();
  });

  it('blocks protocol-relative and bare-relative values', () => {
    expect(toSafeHref('//evil.com')).toBeNull();
    expect(toSafeHref('relative/no/slash')).toBeNull();
  });

  it('allows absolute http(s) URLs', () => {
    expect(toSafeHref('https://ok.com/path')).toBe('https://ok.com/path');
    expect(toSafeHref('http://ok.com/path')).toBe('http://ok.com/path');
  });

  it('normalizes legacy English CMS links without losing parameters or anchors', () => {
    expect(toSafeHref('/en/forms/iris-access?source=article#form')).toBe(
      '/forms/iris-access?source=article#form'
    );
    expect(toSafeHref('/en#section')).toBe('/#section');
    expect(
      toSafeHref('https://toddagriscience.com/en/research?topic=soil#article')
    ).toBe('https://toddagriscience.com/research?topic=soil#article');
    expect(
      toSafeHref('https://www.toddagriscience.com/en/forms/iris-access')
    ).toBe('https://www.toddagriscience.com/forms/iris-access');
  });

  it('preserves Spanish and unrelated third-party language prefixes', () => {
    expect(toSafeHref('/es/research')).toBe('/es/research');
    expect(toSafeHref('https://example.com/en/research')).toBe(
      'https://example.com/en/research'
    );
  });

  it('allows root-relative paths, fragments, mailto and tel', () => {
    expect(toSafeHref('/index/my-article')).toBe('/index/my-article');
    expect(toSafeHref('#section')).toBe('#section');
    expect(toSafeHref('mailto:hello@todd.com')).toBe('mailto:hello@todd.com');
    expect(toSafeHref('tel:+15551234567')).toBe('tel:+15551234567');
  });
});

describe('isOutboundHref', () => {
  it('flags absolute outbound links only', () => {
    expect(isOutboundHref('https://ok.com/')).toBe(true);
    expect(isOutboundHref('mailto:hello@todd.com')).toBe(true);
    expect(isOutboundHref('tel:+1555')).toBe(true);
    expect(isOutboundHref('/index/x')).toBe(false);
    expect(isOutboundHref('#section')).toBe(false);
  });
});
