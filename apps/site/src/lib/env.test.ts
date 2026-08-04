// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAuthRedirectBaseUrl } from './env';

const URL_ENV_KEYS = [
  'NEXT_PUBLIC_BASE_URL',
  'NEXT_PUBLIC_PRODUCTION_DOMAIN',
  'NEXT_PUBLIC_VERCEL_ENV',
  'VERCEL_ENV',
  'NEXT_PUBLIC_VERCEL_BRANCH_URL',
  'VERCEL_BRANCH_URL',
  'NEXT_PUBLIC_VERCEL_URL',
  'VERCEL_URL',
] as const;

const originalEnv: Partial<Record<(typeof URL_ENV_KEYS)[number], string>> = {};

describe('getAuthRedirectBaseUrl', () => {
  beforeEach(() => {
    for (const key of URL_ENV_KEYS) {
      originalEnv[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of URL_ENV_KEYS) {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    }
  });

  describe('outside of preview deployments', () => {
    it('uses NEXT_PUBLIC_BASE_URL when no Vercel environment is set', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });

    it('uses NEXT_PUBLIC_BASE_URL on production deployments', () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';
      process.env.NEXT_PUBLIC_VERCEL_URL = 'nightcrawler-abc123.vercel.app';
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });

    it('keeps a localhost base URL untouched for local development', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

      expect(getAuthRedirectBaseUrl()).toBe('http://localhost:3000');
    });

    it('strips trailing slashes so callers can append a path', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com//';

      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });

    it('adds a scheme to the schemeless NEXT_PUBLIC_PRODUCTION_DOMAIN fallback', () => {
      process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN = 'toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });

    it('falls back to the production origin when nothing is configured', () => {
      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });

    it('treats a whitespace-only base URL as unconfigured', () => {
      process.env.NEXT_PUBLIC_BASE_URL = '   ';
      process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN = 'toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });

    it('never returns a scheme-only origin when every variable is blank', () => {
      process.env.NEXT_PUBLIC_BASE_URL = ' ';
      process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN = '';

      const result = getAuthRedirectBaseUrl();

      expect(result).toBe('https://toddagriscience.com');
      expect(() => new URL('/signup', result)).not.toThrow();
    });

    it('trims surrounding whitespace off a configured base URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL = '  https://toddagriscience.com  ';

      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });
  });

  describe('on preview deployments', () => {
    it('prefers the branch URL over the production base URL', () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
      process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL =
        'nightcrawler-git-feat-preview.vercel.app';
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe(
        'https://nightcrawler-git-feat-preview.vercel.app'
      );
    });

    it('prefers the branch URL over the per-deployment URL', () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
      process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL =
        'nightcrawler-git-feat-preview.vercel.app';
      process.env.NEXT_PUBLIC_VERCEL_URL = 'nightcrawler-abc123.vercel.app';

      expect(getAuthRedirectBaseUrl()).toBe(
        'https://nightcrawler-git-feat-preview.vercel.app'
      );
    });

    it('falls back to the per-deployment URL when no branch URL exists', () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
      process.env.NEXT_PUBLIC_VERCEL_URL = 'nightcrawler-abc123.vercel.app';
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe(
        'https://nightcrawler-abc123.vercel.app'
      );
    });

    it('reads the unprefixed Vercel variables available server-side', () => {
      process.env.VERCEL_ENV = 'preview';
      process.env.VERCEL_BRANCH_URL =
        'nightcrawler-git-feat-preview.vercel.app';
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe(
        'https://nightcrawler-git-feat-preview.vercel.app'
      );
    });

    it('ignores a declared-but-blank NEXT_PUBLIC_VERCEL_ENV', () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = '';
      process.env.VERCEL_ENV = 'preview';
      process.env.VERCEL_BRANCH_URL =
        'nightcrawler-git-feat-preview.vercel.app';
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe(
        'https://nightcrawler-git-feat-preview.vercel.app'
      );
    });

    it('skips a whitespace-only branch URL in favour of the deployment URL', () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
      process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL = '  ';
      process.env.NEXT_PUBLIC_VERCEL_URL = 'nightcrawler-abc123.vercel.app';

      expect(getAuthRedirectBaseUrl()).toBe(
        'https://nightcrawler-abc123.vercel.app'
      );
    });

    it('falls back to the base URL when every Vercel host is blank', () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
      process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL = ' ';
      process.env.NEXT_PUBLIC_VERCEL_URL = '';
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });

    it('falls back to the base URL when no Vercel host is exposed', () => {
      process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';
      process.env.NEXT_PUBLIC_BASE_URL = 'https://toddagriscience.com';

      expect(getAuthRedirectBaseUrl()).toBe('https://toddagriscience.com');
    });
  });
});
