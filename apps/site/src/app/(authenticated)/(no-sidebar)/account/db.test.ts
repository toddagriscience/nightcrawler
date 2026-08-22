// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAccountFarmData, getAccountUsersData } from './db';

/**
 * These tests cover the account page data loaders directly. The account pages
 * mock this module wholesale, so without these tests the shape of what the
 * loaders emit (notably the key holding the principal operator's display name)
 * is never exercised.
 *
 * Rather than spin up a real database, the drizzle query builder is mocked:
 * `select(fields)` (the user query) and `select()` (the farm join) return
 * separate chains whose terminal call resolves a per-test row fixture.
 */

const CURRENT_USER_ID = 7;
const CURRENT_FARM_ID = 3;

const { mockGetAuthenticatedInfo, mockNotFound, mockUserRows, mockFarmRows } =
  vi.hoisted(() => ({
    mockGetAuthenticatedInfo: vi.fn(),
    mockNotFound: vi.fn(() => {
      // Next's `notFound()` throws to unwind the render; emulate that so the
      // loader cannot fall through to the row access.
      throw new Error('NEXT_HTTP_ERROR_FALLBACK;404');
    }),
    mockUserRows: vi.fn(),
    mockFarmRows: vi.fn(),
  }));

vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mockGetAuthenticatedInfo,
}));

vi.mock('next/navigation', () => ({
  notFound: mockNotFound,
}));

vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: {
    select: (fields?: unknown) =>
      fields
        ? {
            from: () => ({
              where: () => ({
                orderBy: () => mockUserRows(),
                limit: () => mockUserRows(),
              }),
            }),
          }
        : {
            from: () => ({
              leftJoin: () => ({
                where: () => ({ limit: () => mockFarmRows() }),
              }),
            }),
          },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockGetAuthenticatedInfo.mockResolvedValue({
    id: CURRENT_USER_ID,
    farmId: CURRENT_FARM_ID,
  });
  mockUserRows.mockResolvedValue([]);
  mockFarmRows.mockResolvedValue([]);
});

describe('getAccountUsersData', () => {
  it('returns the authenticated user as the principal operator with a full display name', async () => {
    mockUserRows.mockResolvedValue([
      {
        id: CURRENT_USER_ID,
        firstName: 'Alex',
        lastName: 'Owner',
        email: 'alex@example.com',
        phone: '+1 (222) 111-3333',
        role: 'Viewer',
      },
      {
        id: 9,
        firstName: 'Jamie',
        lastName: 'Admin',
        email: 'jamie@example.com',
        phone: '+1 (222) 444-5555',
        role: 'Admin',
      },
    ]);

    const { principalOperator, owner } = await getAccountUsersData();

    expect(principalOperator.name).toBe('Alex Owner');
    expect(principalOperator.email).toBe('alex@example.com');
    expect(principalOperator.phone).toBe('+1 (222) 111-3333');

    expect(owner?.name).toBe('Jamie Admin');
    expect(owner?.email).toBe('jamie@example.com');
    expect(owner?.phone).toBe('+1 (222) 444-5555');
  });

  it('falls back to the not-set placeholder for missing contact details', async () => {
    mockUserRows.mockResolvedValue([
      {
        id: CURRENT_USER_ID,
        firstName: 'Alex',
        lastName: '',
        email: 'alex@example.com',
        phone: null,
        role: 'Admin',
      },
    ]);

    const { principalOperator, owner } = await getAccountUsersData();

    expect(principalOperator.name).toBe('Alex');
    expect(principalOperator.phone).toBe('Not set');
    expect(owner).toBeNull();
  });
});

describe('getAccountFarmData', () => {
  it('returns the farm row and its joined location', async () => {
    mockFarmRows.mockResolvedValue([
      {
        farm: { id: CURRENT_FARM_ID, informalName: 'Sunny Acres' },
        farm_location: { id: 11, farmId: CURRENT_FARM_ID },
      },
    ]);

    const { farm, location } = await getAccountFarmData();

    expect(farm).toEqual({ id: CURRENT_FARM_ID, informalName: 'Sunny Acres' });
    expect(location).toEqual({ id: 11, farmId: CURRENT_FARM_ID });
    expect(mockNotFound).not.toHaveBeenCalled();
  });

  it('calls notFound when the authenticated user has no farm row', async () => {
    mockFarmRows.mockResolvedValue([]);

    await expect(getAccountFarmData()).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404'
    );
    expect(mockNotFound).toHaveBeenCalled();
  });
});
