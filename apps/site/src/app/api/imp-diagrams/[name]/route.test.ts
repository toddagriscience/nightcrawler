// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  email: vi.fn(),
  user: vi.fn(),
  agreement: vi.fn(),
  read: vi.fn(),
  get: vi.fn(),
}));
vi.mock('@/lib/auth-server', () => ({ getUserEmail: mocks.email }));
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mocks.user,
}));
vi.mock('@/lib/utils/account-agreement', () => ({
  hasAcceptedAccountAgreement: mocks.agreement,
}));
vi.mock('@nightcrawler/db/queries', () => ({ canReadImpDiagram: mocks.read }));
vi.mock('@nightcrawler/db/utils/imp-diagram-storage', () => ({
  getImpDiagram: mocks.get,
}));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
import { GET } from './route';
const context = {
  params: Promise.resolve({ name: '12345678-1234-4123-8123-123456789abc.png' }),
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.email.mockResolvedValue('client@example.test');
  mocks.user.mockResolvedValue({
    id: 1,
    farmId: 7,
    approved: true,
    role: 'Admin',
  });
  mocks.agreement.mockResolvedValue(true);
  mocks.read.mockResolvedValue(true);
  mocks.get.mockResolvedValue({
    bytes: new Uint8Array([1]),
    contentType: 'image/png',
  });
});
describe('private client diagram route', () => {
  it('denies anonymous callers before any storage read', async () => {
    mocks.email.mockResolvedValue(null);
    expect((await GET(new Request('http://localhost'), context)).status).toBe(
      401
    );
    expect(mocks.get).not.toHaveBeenCalled();
  });
  it('denies unapproved farms and viewers missing agreement', async () => {
    mocks.user.mockResolvedValue({
      id: 1,
      farmId: 7,
      approved: false,
      role: 'Admin',
    });
    expect((await GET(new Request('http://localhost'), context)).status).toBe(
      403
    );
    mocks.user.mockResolvedValue({
      id: 1,
      farmId: 7,
      approved: true,
      role: 'Viewer',
    });
    mocks.agreement.mockResolvedValue(false);
    expect((await GET(new Request('http://localhost'), context)).status).toBe(
      403
    );
    expect(mocks.get).not.toHaveBeenCalled();
  });
  it('returns 404 for another farm or an unpublished image before storage access', async () => {
    mocks.read.mockResolvedValue(false);
    expect((await GET(new Request('http://localhost'), context)).status).toBe(
      404
    );
    expect(mocks.read).toHaveBeenCalledWith(
      '12345678-1234-4123-8123-123456789abc.png',
      7
    );
    expect(mocks.get).not.toHaveBeenCalled();
  });
  it('serves allowed image bytes with private no-store and nosniff headers', async () => {
    const response = await GET(new Request('http://localhost'), context);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});
