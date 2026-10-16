// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ManagementZoneRequestError } from '@nightcrawler/db/utils/management-zone-request';

const mocks = vi.hoisted(() => ({
  actor: vi.fn(),
  create: vi.fn(),
  list: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mocks.actor,
}));
vi.mock('@nightcrawler/db/queries', () => ({
  createManagementZoneRequest: mocks.create,
  getManagementZoneRequests: mocks.list,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidate }));
vi.mock('@/lib/logger', () => ({
  default: { warn: vi.fn() },
  logger: { error: vi.fn() },
}));
import {
  getFarmManagementZoneRequests,
  requestManagementZone,
} from './actions';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.actor.mockResolvedValue({ id: 3, farmId: 2, role: 'Admin' });
  mocks.create.mockResolvedValue({ id: 5, zoneId: 7 });
  mocks.list.mockResolvedValue([]);
});

describe('zone request authorization', () => {
  it('uses the authenticated actor, regardless of identity fields in a forged payload', async () => {
    const input = {
      name: 'North field',
      location: 'West of barn',
      farmId: 99,
      requestedByUserId: 99,
      status: 'approved',
    };
    expect(await requestManagementZone(input)).toEqual({
      success: true,
      zoneId: 7,
    });
    expect(mocks.create).toHaveBeenCalledWith({ id: 3, farmId: 2 }, input);
    expect(mocks.revalidate).toHaveBeenCalledWith('/');
  });
  it('denies a Viewer even when called directly', async () => {
    mocks.actor.mockResolvedValue({ id: 3, farmId: 2, role: 'Viewer' });
    expect(
      (await requestManagementZone({ name: 'North', location: 'Barn' })).success
    ).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it('denies an unauthenticated caller before any write', async () => {
    mocks.actor.mockRejectedValue(new Error('Not authenticated'));
    expect(
      (await requestManagementZone({ name: 'North', location: 'Barn' })).success
    ).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it('scopes request reads to the current farm', async () => {
    await getFarmManagementZoneRequests();
    expect(mocks.list).toHaveBeenCalledWith(2);
  });
  it('returns safe validation errors but hides database details', async () => {
    mocks.create.mockRejectedValueOnce(
      new ManagementZoneRequestError('Enter a zone name.')
    );
    expect(await requestManagementZone({ name: '', location: 'Barn' })).toEqual(
      { success: false, error: 'Enter a zone name.' }
    );
    mocks.create.mockRejectedValueOnce(
      new Error('postgres://secret database error')
    );
    expect(
      await requestManagementZone({ name: 'North', location: 'Barn' })
    ).toEqual({
      success: false,
      error: 'Unable to submit your request. Please try again.',
    });
  });
});
