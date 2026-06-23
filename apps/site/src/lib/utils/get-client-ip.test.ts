// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { getClientIp } from './get-client-ip';

describe('getClientIp', () => {
  it('returns the first IP from a comma-separated x-forwarded-for header', () => {
    const headers = new Headers({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' });
    expect(getClientIp(headers)).toBe('1.1.1.1');
  });

  it('returns the single IP when only one is present', () => {
    const headers = new Headers({ 'x-forwarded-for': '3.3.3.3' });
    expect(getClientIp(headers)).toBe('3.3.3.3');
  });

  it('falls back to "unknown" when the header is absent', () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe('unknown');
  });

  it('falls back to "unknown" when the header is empty', () => {
    const headers = new Headers({ 'x-forwarded-for': '   ' });
    expect(getClientIp(headers)).toBe('unknown');
  });
});
