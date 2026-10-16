// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ManagementZoneRequestError } from '@nightcrawler/db/utils/management-zone-request';
const mocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  list: vi.fn(),
  advance: vi.fn(),
}));
vi.mock('@/lib/require-internal-account', () => ({
  requireInternalAccount: mocks.authorize,
}));
vi.mock('@nightcrawler/db/queries', () => ({
  getManagementZoneRequests: mocks.list,
  advanceManagementZoneRequest: mocks.advance,
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/logger', () => ({ default: { error: vi.fn() } }));
import { getZoneRequests, updateZoneRequest } from './actions';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.authorize.mockResolvedValue({ id: 9, email: 'staff@example.test' });
  mocks.list.mockResolvedValue([]);
  mocks.advance.mockResolvedValue(undefined);
});

describe('zone request staff authorization', () => {
  it('uses the internal account as reviewer', async () => {
    expect(await updateZoneRequest(5, 'sample_kit_sent')).toEqual({
      success: true,
    });
    expect(mocks.advance).toHaveBeenCalledWith(5, 'sample_kit_sent', 9);
  });
  it.each(['list', 'update'])(
    'denies client or inactive accounts before %s',
    async (operation) => {
      mocks.authorize.mockRejectedValue(new Error('Unauthorized'));
      await expect(
        operation === 'list'
          ? getZoneRequests()
          : updateZoneRequest(5, 'processed')
      ).rejects.toThrow('Unauthorized');
      expect(mocks.list).not.toHaveBeenCalled();
      expect(mocks.advance).not.toHaveBeenCalled();
    }
  );
  it('displays controlled state errors without exposing database errors', async () => {
    mocks.advance.mockRejectedValueOnce(
      new ManagementZoneRequestError('Add the soil analysis first.')
    );
    expect(await updateZoneRequest(5, 'processed')).toEqual({
      success: false,
      error: 'Add the soil analysis first.',
    });
    mocks.advance.mockRejectedValueOnce(new Error('SQL credential detail'));
    expect(await updateZoneRequest(5, 'processed')).toEqual({
      success: false,
      error: 'Unable to update the request. Please try again.',
    });
  });
});
