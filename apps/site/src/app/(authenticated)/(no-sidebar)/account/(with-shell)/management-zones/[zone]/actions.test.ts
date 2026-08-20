// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { and, eq } from 'drizzle-orm';
import { managementZone } from '@nightcrawler/db/schema';
import type { ManagementZoneInsert } from '@/lib/types/db';

/**
 * These tests verify that `updateManagementZone` only writes the columns the
 * edit form owns. The form seeds react-hook-form from the whole zone row, so
 * every submission posts `id`/`farmId`/`createdAt`/`updatedAt` back to the
 * server; spreading that payload into `.set()` let a farm Admin rewrite its own
 * identity columns (mass assignment). Rather than spin up a real database, we
 * mock the drizzle query builder and capture what reaches `.set(...)`.
 */

const CURRENT_USER_ID = 4242;
const CURRENT_FARM_ID = 77;
const OTHER_FARM_ID = 99;
const ZONE_ID = 5;

const { mockGetAuthenticatedInfo } = vi.hoisted(() => ({
  mockGetAuthenticatedInfo: vi.fn(),
}));

vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mockGetAuthenticatedInfo,
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn() },
  default: { error: vi.fn(), warn: vi.fn() },
}));

// Capture what each mutation passes to its terminal builders.
const capturedWhere: { value: unknown } = { value: undefined };
const capturedUpdateData: { value: unknown } = { value: undefined };
const capturedInsertValues: { value: unknown } = { value: undefined };

const { mockDelete, mockUpdate, mockInsert } = vi.hoisted(() => ({
  mockDelete: vi.fn(),
  mockUpdate: vi.fn(),
  mockInsert: vi.fn(),
}));

vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: {
    delete: mockDelete,
    update: mockUpdate,
    insert: mockInsert,
  },
}));

import {
  createManagementZone,
  deleteManagementZone,
  updateManagementZone,
} from './actions';

/**
 * Recursively collect every primitive bound-parameter value out of a drizzle
 * SQL/condition object (walking nested `queryChunks` and `Param.value`).
 */
function collectParamValues(node: unknown, out: unknown[] = []): unknown[] {
  if (node === null || node === undefined) return out;
  if (typeof node !== 'object') return out;

  const obj = node as Record<string, unknown>;

  // drizzle Param nodes expose the bound value on `.value`.
  if ('value' in obj && typeof obj.value !== 'object') {
    out.push(obj.value);
  }

  if (Array.isArray(obj.queryChunks)) {
    for (const chunk of obj.queryChunks) collectParamValues(chunk, out);
  }
  if (Array.isArray(node)) {
    for (const item of node) collectParamValues(item, out);
  }
  return out;
}

/**
 * Asserts the captured WHERE is farm-scoped: it must bind BOTH the zone id and
 * the authenticated user's farm id, so the test fails if either is dropped.
 */
function expectFarmScopedWhere(captured: unknown, zoneId: number) {
  const expected = and(
    eq(managementZone.id, zoneId),
    eq(managementZone.farmId, CURRENT_FARM_ID)
  );

  const capturedParams = collectParamValues(captured);
  const expectedParams = collectParamValues(expected);

  expect(capturedParams).toContain(CURRENT_FARM_ID);
  expect(capturedParams).toContain(zoneId);
  expect([...capturedParams].sort()).toEqual([...expectedParams].sort());
}

/**
 * Builds a payload shaped like a real form submission, which round-trips the
 * whole stored row back to the server alongside the edited fields.
 */
function makeFormPayload(
  overrides: Partial<ManagementZoneInsert> = {}
): ManagementZoneInsert {
  return {
    id: ZONE_ID,
    farmId: CURRENT_FARM_ID,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2020-01-01'),
    name: 'North field',
    location: [12.5, -3.25],
    rotationYear: new Date('2026-03-01'),
    npk: true,
    npkLastUsed: new Date('2026-02-01'),
    irrigation: false,
    waterConservation: true,
    ...overrides,
  } as ManagementZoneInsert;
}

beforeEach(() => {
  vi.clearAllMocks();
  capturedWhere.value = undefined;
  capturedUpdateData.value = undefined;
  capturedInsertValues.value = undefined;
  mockGetAuthenticatedInfo.mockResolvedValue({
    id: CURRENT_USER_ID,
    farmId: CURRENT_FARM_ID,
    role: 'Admin',
  });

  // update().set(data).where(cond).returning(...)
  mockUpdate.mockReturnValue({
    set: (data: unknown) => {
      capturedUpdateData.value = data;
      return {
        where: (cond: unknown) => {
          capturedWhere.value = cond;
          return { returning: () => Promise.resolve([{ id: ZONE_ID }]) };
        },
      };
    },
  });

  // delete().where(cond)
  mockDelete.mockReturnValue({
    where: (cond: unknown) => {
      capturedWhere.value = cond;
      return Promise.resolve(undefined);
    },
  });

  // insert().values(data).returning(...)
  mockInsert.mockReturnValue({
    values: (data: unknown) => {
      capturedInsertValues.value = data;
      return { returning: () => Promise.resolve([{ id: ZONE_ID }]) };
    },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('updateManagementZone', () => {
  it('never writes identity columns, even when the client posts them', async () => {
    await updateManagementZone(ZONE_ID, makeFormPayload());

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const written = capturedUpdateData.value as Record<string, unknown>;

    expect(written).not.toHaveProperty('id');
    expect(written).not.toHaveProperty('farmId');
    expect(written).not.toHaveProperty('createdAt');
    expect(written).not.toHaveProperty('updatedAt');
  });

  it('ignores a farmId that would move the zone to another farm', async () => {
    await updateManagementZone(
      ZONE_ID,
      makeFormPayload({ farmId: OTHER_FARM_ID })
    );

    const written = capturedUpdateData.value as Record<string, unknown>;

    expect(written).not.toHaveProperty('farmId');
    expect(Object.values(written)).not.toContain(OTHER_FARM_ID);
  });

  it('writes every field the form owns', async () => {
    await updateManagementZone(ZONE_ID, makeFormPayload());

    expect(capturedUpdateData.value).toEqual({
      name: 'North field',
      location: [12.5, -3.25],
      rotationYear: new Date('2026-03-01'),
      npk: true,
      npkLastUsed: new Date('2026-02-01'),
      irrigation: false,
      waterConservation: true,
    });
  });

  it('preserves null so an optional date can be cleared', async () => {
    await updateManagementZone(
      ZONE_ID,
      makeFormPayload({ npkLastUsed: null, rotationYear: null })
    );

    const written = capturedUpdateData.value as Record<string, unknown>;

    expect(written.npkLastUsed).toBeNull();
    expect(written.rotationYear).toBeNull();
  });

  it('drops undefined fields so untouched values are left alone', async () => {
    await updateManagementZone(
      ZONE_ID,
      makeFormPayload({ npkLastUsed: undefined, rotationYear: undefined })
    );

    const written = capturedUpdateData.value as Record<string, unknown>;

    expect(written).not.toHaveProperty('npkLastUsed');
    expect(written).not.toHaveProperty('rotationYear');
    expect(written).toHaveProperty('name', 'North field');
  });

  it('keeps the update scoped to the zone and the caller’s farm', async () => {
    await updateManagementZone(ZONE_ID, makeFormPayload());

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expectFarmScopedWhere(capturedWhere.value, ZONE_ID);
  });

  it('rejects a payload with no editable fields without touching the db', async () => {
    await expect(
      updateManagementZone(ZONE_ID, {
        id: ZONE_ID,
        farmId: OTHER_FARM_ID,
      } as ManagementZoneInsert)
    ).rejects.toThrow();

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('rejects an invalid (non-integer) zone id without touching the db', async () => {
    await expect(
      updateManagementZone(1.5, makeFormPayload())
    ).rejects.toThrow();

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('rejects a non-admin caller without touching the db', async () => {
    mockGetAuthenticatedInfo.mockResolvedValue({
      id: CURRENT_USER_ID,
      farmId: CURRENT_FARM_ID,
      role: 'Member',
    });

    await expect(
      updateManagementZone(ZONE_ID, makeFormPayload())
    ).rejects.toThrow();

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('rejects a caller with no farm without touching the db', async () => {
    mockGetAuthenticatedInfo.mockResolvedValue({
      id: CURRENT_USER_ID,
      farmId: null,
      role: 'Admin',
    });

    await expect(
      updateManagementZone(ZONE_ID, makeFormPayload())
    ).rejects.toThrow();

    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('createManagementZone', () => {
  it('takes farmId from the session rather than the client', async () => {
    await createManagementZone('New zone');

    expect(capturedInsertValues.value).toEqual({
      farmId: CURRENT_FARM_ID,
      name: 'New zone',
    });
  });
});

describe('deleteManagementZone', () => {
  it('keeps the delete scoped to the zone and the caller’s farm', async () => {
    await deleteManagementZone(ZONE_ID);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expectFarmScopedWhere(capturedWhere.value, ZONE_ID);
  });
});
