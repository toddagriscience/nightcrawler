// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  loggerWarn: vi.fn(),
  loggerError: vi.fn(),
  limit: vi.fn(),
  fromEnv: vi.fn(() => ({})),
  slidingWindow: vi.fn(() => ({})),
  headers: vi.fn(),
  throwActionError: vi.fn((message: string) => {
    throw new Error(message);
  }),
}));

vi.mock('@/lib/logger', () => ({
  logger: { warn: mocks.loggerWarn, error: mocks.loggerError },
  default: { warn: mocks.loggerWarn, error: mocks.loggerError },
}));

vi.mock('@upstash/redis', () => ({
  Redis: { fromEnv: mocks.fromEnv },
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    static slidingWindow = mocks.slidingWindow;
    limit = mocks.limit;
  },
}));

vi.mock('next/headers', () => ({
  headers: mocks.headers,
}));

vi.mock('@/lib/utils/actions', () => ({
  throwActionError: mocks.throwActionError,
}));

/**
 * Imports a fresh copy of the rate-limit module so module-level singletons
 * (shared Redis client, limiter cache, one-time-warn flag) are reset between
 * test cases.
 *
 * @returns The freshly evaluated module exports.
 */
async function importFresh() {
  vi.resetModules();
  return import('./rate-limit');
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.headers.mockResolvedValue(
    new Headers({ 'x-forwarded-for': '1.2.3.4' })
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('createRateLimiter', () => {
  describe('when Upstash env vars are missing', () => {
    beforeEach(() => {
      vi.stubEnv('UPSTASH_REDIS_REST_URL', undefined);
      vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', undefined);
    });

    it('fails open, does not call the limiter, and warns once', async () => {
      const { createRateLimiter } = await importFresh();
      const check = createRateLimiter({
        requests: 5,
        window: '60 s',
        prefix: 'test',
      });

      const first = await check('1.2.3.4');
      const second = await check('1.2.3.4');

      expect(first).toEqual({ success: true });
      expect(second).toEqual({ success: true });
      expect(mocks.loggerWarn).toHaveBeenCalledTimes(1);
      expect(mocks.limit).not.toHaveBeenCalled();
    });
  });

  describe('when Upstash env vars are present', () => {
    beforeEach(() => {
      vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example.upstash.io');
      vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'token');
    });

    it('allows the request when under the limit', async () => {
      mocks.limit.mockResolvedValueOnce({ success: true });
      const { createRateLimiter } = await importFresh();
      const check = createRateLimiter({
        requests: 5,
        window: '60 s',
        prefix: 'test',
      });

      expect(await check('1.2.3.4')).toEqual({ success: true });
    });

    it('blocks the request when over the limit', async () => {
      mocks.limit.mockResolvedValueOnce({ success: false });
      const { createRateLimiter } = await importFresh();
      const check = createRateLimiter({
        requests: 5,
        window: '60 s',
        prefix: 'test',
      });

      expect(await check('1.2.3.4')).toEqual({ success: false });
    });

    it('passes the identifier through to the limiter', async () => {
      mocks.limit.mockResolvedValueOnce({ success: true });
      const { createRateLimiter } = await importFresh();
      const check = createRateLimiter({
        requests: 5,
        window: '60 s',
        prefix: 'test',
      });

      await check('9.9.9.9');

      expect(mocks.limit).toHaveBeenCalledTimes(1);
      expect(mocks.limit).toHaveBeenCalledWith('9.9.9.9');
    });

    it('reuses a single Redis client across limiters', async () => {
      mocks.limit.mockResolvedValue({ success: true });
      const { createRateLimiter } = await importFresh();

      const a = createRateLimiter({
        requests: 5,
        window: '60 s',
        prefix: 'a',
      });
      const b = createRateLimiter({
        requests: 1,
        window: '10 s',
        prefix: 'b',
      });
      await a('1.1.1.1');
      await b('2.2.2.2');

      expect(mocks.fromEnv).toHaveBeenCalledTimes(1);
    });

    it('fails open and logs when Redis throws', async () => {
      mocks.limit.mockRejectedValueOnce(new Error('redis down'));
      const { createRateLimiter } = await importFresh();
      const check = createRateLimiter({
        requests: 5,
        window: '60 s',
        prefix: 'test',
      });

      expect(await check('1.2.3.4')).toEqual({ success: true });
      expect(mocks.loggerError).toHaveBeenCalledTimes(1);
    });

    it('under a ~100 requests/second burst from one IP, allows only the configured limit and blocks the rest', async () => {
      // Stateful fake mirroring a sliding window: the first `LIMIT` hits from an
      // identifier within the window succeed; every subsequent hit is blocked.
      const LIMIT = 5;
      const counts = new Map<string, number>();
      mocks.limit.mockImplementation(async (id: string) => {
        const next = (counts.get(id) ?? 0) + 1;
        counts.set(id, next);
        return { success: next <= LIMIT };
      });

      const { createRateLimiter } = await importFresh();
      const check = createRateLimiter({
        requests: LIMIT,
        window: '60 s',
        prefix: 'burst',
      });

      // Fire 100 concurrent requests in the same second from the same IP.
      const REQUESTS = 100;
      const results = await Promise.all(
        Array.from({ length: REQUESTS }, () => check('1.2.3.4'))
      );
      const allowed = results.filter((r) => r.success).length;
      const blocked = results.filter((r) => !r.success).length;

      expect(allowed).toBe(LIMIT);
      expect(blocked).toBe(REQUESTS - LIMIT);
      expect(mocks.limit).toHaveBeenCalledTimes(REQUESTS);
    });

    it('gives each distinct IP its own budget under a burst', async () => {
      const LIMIT = 5;
      const counts = new Map<string, number>();
      mocks.limit.mockImplementation(async (id: string) => {
        const next = (counts.get(id) ?? 0) + 1;
        counts.set(id, next);
        return { success: next <= LIMIT };
      });

      const { createRateLimiter } = await importFresh();
      const check = createRateLimiter({
        requests: LIMIT,
        window: '60 s',
        prefix: 'burst',
      });

      // 100 requests split across 10 IPs → each IP stays under its own limit.
      const results = await Promise.all(
        Array.from({ length: 100 }, (_, i) => check(`10.0.0.${i % 10}`))
      );

      // 10 IPs × 5 allowed each = 50 allowed, 50 blocked.
      expect(results.filter((r) => r.success).length).toBe(50);
      expect(results.filter((r) => !r.success).length).toBe(50);
    });
  });
});

describe('enforceRateLimit', () => {
  beforeEach(() => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'token');
  });

  it('does not throw when the request is under the limit', async () => {
    mocks.limit.mockResolvedValueOnce({ success: true });
    const { enforceRateLimit } = await importFresh();

    await expect(enforceRateLimit()).resolves.toBeUndefined();
    expect(mocks.throwActionError).not.toHaveBeenCalled();
    // Resolves the client IP from x-forwarded-for and forwards it.
    expect(mocks.limit).toHaveBeenCalledWith('1.2.3.4');
  });

  it('throws an action error when the limit is exceeded', async () => {
    mocks.limit.mockResolvedValueOnce({ success: false });
    const { enforceRateLimit } = await importFresh();

    await expect(enforceRateLimit()).rejects.toThrow(
      'Too many requests. Please try again shortly.'
    );
    expect(mocks.throwActionError).toHaveBeenCalledTimes(1);
  });

  it('uses a custom limiter and message when provided', async () => {
    mocks.limit.mockResolvedValueOnce({ success: false });
    const { createRateLimiter, enforceRateLimit } = await importFresh();
    const strict = createRateLimiter({
      requests: 1,
      window: '60 s',
      prefix: 'strict',
    });

    await expect(enforceRateLimit(strict, 'Slow down.')).rejects.toThrow(
      'Slow down.'
    );
  });

  it('fails open (no throw) when Upstash is not configured', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', undefined);
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', undefined);
    const { enforceRateLimit } = await importFresh();

    await expect(enforceRateLimit()).resolves.toBeUndefined();
    expect(mocks.throwActionError).not.toHaveBeenCalled();
  });
});
