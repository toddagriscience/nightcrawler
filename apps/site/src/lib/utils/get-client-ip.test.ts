// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { getClientIp } from './get-client-ip';

describe('getClientIp', () => {
  it('prefers the edge-set x-vercel-forwarded-for over client-writable headers', () => {
    const headers = new Headers({
      'x-vercel-forwarded-for': '9.9.9.9',
      'x-forwarded-for': '1.1.1.1, 2.2.2.2',
      'x-real-ip': '3.3.3.3',
    });

    expect(getClientIp(headers)).toBe('9.9.9.9');
  });

  it('chooses the right-most x-forwarded-for hop', () => {
    const headers = new Headers({
      'x-forwarded-for': '1.1.1.1, 2.2.2.2, 3.3.3.3',
    });

    expect(getClientIp(headers)).toBe('3.3.3.3');
  });

  it('ignores a spoofed left-most entry so header rotation cannot mint new buckets', () => {
    const proxyAppendedIp = '4.4.4.4';
    const first = getClientIp(
      new Headers({ 'x-forwarded-for': `evil-1, ${proxyAppendedIp}` })
    );
    const second = getClientIp(
      new Headers({ 'x-forwarded-for': `evil-2, ${proxyAppendedIp}` })
    );

    expect(first).toBe(proxyAppendedIp);
    expect(second).toBe(proxyAppendedIp);
    expect(first).toBe(second);
  });

  it('returns the single IP when only one hop is present', () => {
    expect(getClientIp(new Headers({ 'x-forwarded-for': '3.3.3.3' }))).toBe(
      '3.3.3.3'
    );
  });

  it('skips blank hops when picking the right-most entry', () => {
    expect(
      getClientIp(new Headers({ 'x-forwarded-for': '5.5.5.5,   ,  ' }))
    ).toBe('5.5.5.5');
  });

  it('falls back to x-real-ip when no forwarded-for header is usable', () => {
    expect(
      getClientIp(
        new Headers({ 'x-forwarded-for': '  ', 'x-real-ip': '6.6.6.6' })
      )
    ).toBe('6.6.6.6');
  });

  it('returns null when nothing trustworthy is present', () => {
    expect(getClientIp(new Headers())).toBeNull();
  });

  it('returns null when every candidate header is empty', () => {
    const headers = new Headers({
      'x-vercel-forwarded-for': '',
      'x-forwarded-for': ' , ',
      'x-real-ip': '   ',
    });

    expect(getClientIp(headers)).toBeNull();
  });
});
