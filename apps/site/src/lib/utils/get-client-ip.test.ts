// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { getClientIp } from './get-client-ip';

describe('getClientIp', () => {
  it('prefers the edge-set x-vercel-forwarded-for over a client-supplied header', () => {
    const headers = new Headers({
      'x-vercel-forwarded-for': '9.9.9.9',
      'x-forwarded-for': '1.1.1.1, 2.2.2.2',
    });
    expect(getClientIp(headers)).toBe('9.9.9.9');
  });

  it('takes the right-most x-forwarded-for hop, not the client-controlled left-most', () => {
    // x-forwarded-for is append-style, so the left-most entry is whatever the
    // client sent. Keying on it would let an attacker rotate the header and get
    // a fresh bucket per request, making the limiter a no-op.
    const headers = new Headers({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' });
    expect(getClientIp(headers)).toBe('2.2.2.2');
  });

  it('ignores a spoofed left-most entry even when the client sends many', () => {
    const headers = new Headers({
      'x-forwarded-for': 'evil-1, evil-2, evil-3, 203.0.113.7',
    });
    expect(getClientIp(headers)).toBe('203.0.113.7');
  });

  it('returns the single IP when only one is present', () => {
    const headers = new Headers({ 'x-forwarded-for': '3.3.3.3' });
    expect(getClientIp(headers)).toBe('3.3.3.3');
  });

  it('falls back to x-real-ip when no forwarding header is set', () => {
    const headers = new Headers({ 'x-real-ip': '4.4.4.4' });
    expect(getClientIp(headers)).toBe('4.4.4.4');
  });

  it('returns null when no header is present', () => {
    // Deliberately null rather than a sentinel string: a shared constant would
    // put every header-less request into one bucket and rate-limit the whole
    // world collectively.
    expect(getClientIp(new Headers())).toBeNull();
  });

  it('returns null when the header is blank', () => {
    const headers = new Headers({ 'x-forwarded-for': '   ' });
    expect(getClientIp(headers)).toBeNull();
  });

  it('returns null when the header is only separators', () => {
    const headers = new Headers({ 'x-forwarded-for': ' , , ' });
    expect(getClientIp(headers)).toBeNull();
  });
});
