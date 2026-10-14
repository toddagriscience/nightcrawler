// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCspNonce } from './get-csp-nonce';

const requestHeaders = vi.hoisted(() => vi.fn());
vi.mock('next/headers', () => ({ headers: requestHeaders }));
beforeEach(() => vi.clearAllMocks());

describe('getCspNonce', () => {
  it('reads the per-request forwarded nonce without caching it', async () => {
    const firstNonce = 'a'.repeat(32);
    const secondNonce = 'B'.repeat(32);
    requestHeaders
      .mockResolvedValueOnce(new Headers({ 'x-nonce': firstNonce }))
      .mockResolvedValueOnce(new Headers({ 'x-nonce': secondNonce }));
    expect(await getCspNonce()).toBe(firstNonce);
    expect(await getCspNonce()).toBe(secondNonce);
    expect(requestHeaders).toHaveBeenCalledTimes(2);
  });
  it.each([undefined, 'invalid nonce', '<script>unsafe()</script>'])(
    'rejects missing or malformed nonce %s',
    async (value) => {
      requestHeaders.mockResolvedValue(
        new Headers(value ? { 'x-nonce': value } : undefined)
      );
      expect(await getCspNonce()).toBeUndefined();
    }
  );
});
