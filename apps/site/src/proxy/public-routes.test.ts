// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { isKnownPublicRoute } from './public-routes';

describe('public route existence before streaming', () => {
  it.each([
    '/',
    '/es',
    '/about',
    '/es/about',
    '/index/introducing-iris',
    '/es/careers/engineer',
    '/forms/access',
    '/auth/confirm',
    '/research/index/research-publication',
  ])('allows the existing route shape %s', (path) =>
    expect(isKnownPublicRoute(path)).toBe(true)
  );
  it.each([
    '/does-not-exist',
    '/es/does-not-exist',
    '/research/index/unknown-topic',
    '/about/person/extra',
    '/contact/extra',
    '/auth/missing',
  ])('rejects unknown route %s before a 200 shell can be sent', (path) =>
    expect(isKnownPublicRoute(path)).toBe(false)
  );
});
