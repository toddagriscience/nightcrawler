// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ authorize: vi.fn(), get: vi.fn() }));
vi.mock('@/lib/require-internal-account', () => ({
  requireInternalAccount: mocks.authorize,
}));
vi.mock('@nightcrawler/db/utils/imp-diagram-storage', () => ({
  getImpDiagram: mocks.get,
}));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
import { GET } from './route';
const name = '12345678-1234-4123-8123-123456789abc.png';
beforeEach(() => {
  vi.resetAllMocks();
  mocks.authorize.mockResolvedValue({ id: 1 });
  mocks.get.mockResolvedValue({
    bytes: new Uint8Array([1]),
    contentType: 'image/png',
  });
});
it('authorizes staff even though API routes bypass the proxy matcher', async () => {
  mocks.authorize.mockRejectedValue(new Error('Unauthorized'));
  expect(
    (
      await GET(new Request('http://localhost'), {
        params: Promise.resolve({ name }),
      })
    ).status
  ).toBe(401);
  expect(mocks.get).not.toHaveBeenCalled();
});
it('refuses arbitrary bucket paths before storage access', async () => {
  expect(
    (
      await GET(new Request('http://localhost'), {
        params: Promise.resolve({ name: 'secret.png' }),
      })
    ).status
  ).toBe(404);
  expect(mocks.get).not.toHaveBeenCalled();
});
it('serves active-staff previews without public caching', async () => {
  const response = await GET(new Request('http://localhost'), {
    params: Promise.resolve({ name }),
  });
  expect(response.status).toBe(200);
  expect(response.headers.get('Cache-Control')).toBe('private, no-store');
});
