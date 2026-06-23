// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
import { logger } from '@/lib/logger';
import { throwActionError } from '@/lib/utils/actions';
import { getClientIp } from '@/lib/utils/get-client-ip';

/**
 * Reusable IP-based rate limiting for public, unauthenticated endpoints.
 *
 * Backed by Upstash Redis via `@upstash/ratelimit`. A single Redis client is
 * shared across every limiter. Everything fails open: when the Upstash
 * environment variables are missing (local dev, CI, preview deployments) or
 * when Redis itself errors, requests are allowed through so legitimate users
 * are never blocked by infrastructure.
 *
 * Typical usage from a server action:
 *
 * ```ts
 * await enforceRateLimit();                 // default public-write limit
 * await enforceRateLimit(myStricterLimit);  // a custom preset
 * ```
 */

/** A sliding-window duration accepted by Upstash (e.g. `'60 s'`, `'1 m'`). */
export type RateLimitWindow = `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;

/** Configuration for a single named rate limiter. */
export interface RateLimitConfig {
  /** Requests permitted per identifier per window. */
  requests: number;
  /** Sliding-window duration. */
  window: RateLimitWindow;
  /** Redis key prefix namespacing this limiter's buckets. */
  prefix: string;
}

/** Checks a single identifier against a limiter; resolves to its verdict. */
export type RateLimitCheck = (
  identifier: string
) => Promise<{ success: boolean }>;

/** Shared Redis client, or `null` once resolved as unavailable (fail open). */
let redisClient: Redis | null = null;

/** Whether the shared Redis client has been resolved yet. */
let redisResolved = false;

/** Ensures the "rate limiting disabled" warning is logged at most once. */
let warnedMissingEnv = false;

/** Per-prefix limiter cache so each limiter is constructed only once. */
const limiterCache = new Map<string, Ratelimit>();

/**
 * Lazily resolves the shared Upstash Redis client.
 *
 * Returns `null` when the Upstash environment variables are absent, signalling
 * callers to fail open. A one-time warning is logged in that case.
 *
 * @returns The shared Redis client, or `null` when rate limiting is disabled.
 */
function getRedis(): Redis | null {
  if (redisResolved) {
    return redisClient;
  }

  redisResolved = true;

  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    if (!warnedMissingEnv) {
      warnedMissingEnv = true;
      logger.warn(
        '[rate-limit] Upstash env vars missing; rate limiting disabled (failing open).'
      );
    }
    return null;
  }

  redisClient = Redis.fromEnv();
  return redisClient;
}

/**
 * Builds a reusable rate-limit checker for the given configuration.
 *
 * The returned function checks one identifier (typically a client IP) against a
 * sliding window. Limiters are cached per `prefix` and share one Redis client.
 * Fails open when Upstash is unconfigured or when the Redis call throws.
 *
 * @param config - Requests, window, and key prefix for this limiter.
 * @returns A checker resolving `{ success }` for a given identifier.
 */
export function createRateLimiter(config: RateLimitConfig): RateLimitCheck {
  return async (identifier: string) => {
    const redis = getRedis();
    if (!redis) {
      return { success: true };
    }

    let limiter = limiterCache.get(config.prefix);
    if (!limiter) {
      limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.requests, config.window),
        prefix: config.prefix,
      });
      limiterCache.set(config.prefix, limiter);
    }

    try {
      const { success } = await limiter.limit(identifier);
      return { success };
    } catch (error) {
      logger.error('[rate-limit] Redis error; failing open.', error);
      return { success: true };
    }
  };
}

/**
 * Default limiter for public, unauthenticated write endpoints: 5 requests per
 * IP per 60 seconds. Reuse this across the contact form, CMS forms, and any
 * other public write action that should share one budget.
 */
export const publicWriteRateLimit = createRateLimiter({
  requests: 5,
  window: '60 s',
  prefix: 'site:public-write',
});

/**
 * Enforces a rate limit for the current server action request.
 *
 * Resolves the client IP from request headers, checks it against the given
 * limiter, and throws an action error when the limit is exceeded. This is the
 * one-line guard server actions should call before doing any work.
 *
 * @param check - Limiter to enforce. Defaults to {@link publicWriteRateLimit}.
 * @param message - Error surfaced to the client when rate limited.
 */
export async function enforceRateLimit(
  check: RateLimitCheck = publicWriteRateLimit,
  message = 'Too many requests. Please try again shortly.'
): Promise<void> {
  const ip = getClientIp(await headers());
  const { success } = await check(ip);
  if (!success) {
    throwActionError(message);
  }
}
