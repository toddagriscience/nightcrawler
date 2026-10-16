// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
}));
vi.mock('@/lib/require-internal-account', () => ({
  requireInternalAccount: mocks.authorize,
}));
vi.mock('@nightcrawler/db', () => ({ db: { update: mocks.update } }));
vi.mock('@nightcrawler/db/queries', () => ({
  createFarmDefaultSettings: vi.fn(),
}));
vi.mock('@/lib/logger', () => ({ default: { error: vi.fn() } }));
import { updateManagementZone } from './actions';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.authorize.mockResolvedValue({ id: 9 });
  mocks.update.mockReturnValue({ set: mocks.set });
  mocks.set.mockReturnValue({
    where: () => ({ returning: async () => [{ id: 7 }] }),
  });
});

describe('internal zone edit boundary', () => {
  it('does not spread forged identity, timestamp, approval or workflow fields into the update', async () => {
    await updateManagementZone(7, {
      name: 'North field',
      npkLastUsed: '2026-01-01',
      id: 88,
      createdAt: new Date(),
      updatedAt: new Date(),
      approved: true,
      status: 'processed',
    } as never);
    expect(mocks.set).toHaveBeenCalledWith({
      farmId: undefined,
      name: 'North field',
      npk: undefined,
      npkLastUsed: new Date('2026-01-01'),
      irrigation: undefined,
      waterConservation: undefined,
    });
  });
  it('denies non-staff before querying the database', async () => {
    mocks.authorize.mockRejectedValue(new Error('Unauthorized'));
    await expect(
      updateManagementZone(7, { name: 'North field' })
    ).rejects.toThrow('Unauthorized');
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it('rejects invalid zone ids and dates before writing', async () => {
    expect(await updateManagementZone(1.5, { name: 'North' })).toBeNull();
    expect(
      await updateManagementZone(7, { npkLastUsed: 'invalid' })
    ).toBeNull();
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
