// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getSearchModalData } from '@/app/(authenticated)/actions/search-modal';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetAuthenticatedInfo, mockGetAllImps, mockGetAllSeedProducts } =
  vi.hoisted(() => ({
    mockGetAuthenticatedInfo: vi.fn(),
    mockGetAllImps: vi.fn(),
    mockGetAllSeedProducts: vi.fn(),
  }));

vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mockGetAuthenticatedInfo,
}));

vi.mock('@/lib/db/imps', () => ({
  getAllImps: mockGetAllImps,
}));

vi.mock('@/lib/db/seeds', () => ({
  getAllSeedProducts: mockGetAllSeedProducts,
}));

describe('getSearchModalData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthenticatedInfo.mockResolvedValue({ id: 1, farmId: 1 });
    mockGetAllImps.mockResolvedValue([{ id: 1 }]);
    mockGetAllSeedProducts.mockResolvedValue([{ id: 2 }]);
  });

  it('returns imps and seeds for an authenticated user', async () => {
    const result = await getSearchModalData();

    expect(mockGetAuthenticatedInfo).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ imps: [{ id: 1 }], seeds: [{ id: 2 }] });
  });

  it('throws and does not query data when the user is not authenticated', async () => {
    mockGetAuthenticatedInfo.mockRejectedValue(
      new Error("No email registered with this user's account")
    );

    await expect(getSearchModalData()).rejects.toThrow(
      "No email registered with this user's account"
    );
    expect(mockGetAllImps).not.toHaveBeenCalled();
    expect(mockGetAllSeedProducts).not.toHaveBeenCalled();
  });
});
