// Copyright © Todd Agriscience, Inc. All rights reserved.

import { managementZone } from '@nightcrawler/db/schema/management-zone';
import { managementZoneObservation } from '@nightcrawler/db/schema/management-zone-observation';
import { and, eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OBSERVATION_BODY_MAX_LENGTH } from './components/observations/types';

/**
 * These tests verify observation mutations are limited to zones on the
 * authenticated user's farm. The database is mocked so the assertions can
 * inspect the drizzle conditions and the values written.
 */

const USER_ID = 7;
const FARM_ID = 3;
const ZONE_ID = 9;

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

const capturedWheres: unknown[] = [];
const capturedInsert: { value: unknown } = { value: undefined };
const capturedUpdate: { value: unknown } = { value: undefined };

let zoneFound = true;

const { mockDelete, mockUpdate, mockInsert, mockSelect } = vi.hoisted(() => ({
  mockDelete: vi.fn(),
  mockUpdate: vi.fn(),
  mockInsert: vi.fn(),
  mockSelect: vi.fn(),
}));

vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: {
    delete: mockDelete,
    update: mockUpdate,
    insert: mockInsert,
    select: mockSelect,
  },
}));

import {
  createObservation,
  deleteObservation,
  updateObservation,
} from './actions';

/**
 * Recursively collect primitive bound parameters from a drizzle condition.
 *
 * @param node - Drizzle SQL node.
 * @param out - Collected values.
 * @returns The collected values.
 */
function collectParamValues(node: unknown, out: unknown[] = []): unknown[] {
  if (node === null || node === undefined) return out;
  if (typeof node !== 'object') return out;

  const obj = node as Record<string, unknown>;

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
 * Asserts a captured condition binds the same parameters as a reference.
 *
 * @param captured - Where clause recorded by the mock.
 * @param expected - Farm-scoped condition the action should have built.
 */
function expectSameParams(captured: unknown, expected: unknown) {
  const params = collectParamValues(captured);
  expect(params).toContain(FARM_ID);
  expect([...params].sort()).toEqual([...collectParamValues(expected)].sort());
}

beforeEach(() => {
  vi.clearAllMocks();
  capturedWheres.length = 0;
  capturedInsert.value = undefined;
  capturedUpdate.value = undefined;
  zoneFound = true;
  mockGetAuthenticatedInfo.mockResolvedValue({
    id: USER_ID,
    farmId: FARM_ID,
  });

  mockSelect.mockImplementation(() => {
    const chain = {
      from: () => chain,
      innerJoin: () => chain,
      where: (cond: unknown) => {
        capturedWheres.push(cond);
        return chain;
      },
      limit: () => Promise.resolve(zoneFound ? [{ id: 1 }] : []),
    };
    return chain;
  });

  mockInsert.mockReturnValue({
    values: (data: unknown) => {
      capturedInsert.value = data;
      return {
        returning: () => Promise.resolve([{ id: 11 }]),
      };
    },
  });

  mockUpdate.mockReturnValue({
    set: (data: unknown) => {
      capturedUpdate.value = data;
      return {
        where: () => Promise.resolve(undefined),
      };
    },
  });

  mockDelete.mockReturnValue({
    where: () => Promise.resolve(undefined),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('createObservation', () => {
  const observedOn = new Date(Date.UTC(2026, 2, 20, 15, 30));

  it('rejects an empty note before writing', async () => {
    await expect(
      createObservation({ zoneId: ZONE_ID, body: '   ', observedOn })
    ).rejects.toThrow(/required/i);

    expect(mockSelect).not.toHaveBeenCalled();
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('rejects a note longer than the limit before writing', async () => {
    await expect(
      createObservation({
        zoneId: ZONE_ID,
        body: 'a'.repeat(OBSERVATION_BODY_MAX_LENGTH + 1),
        observedOn,
      })
    ).rejects.toThrow(/2000/);

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('rejects a missing date before writing', async () => {
    await expect(
      createObservation({
        zoneId: ZONE_ID,
        body: 'Aphids in the cabbage',
        observedOn: new Date(Number.NaN),
      })
    ).rejects.toThrow(/date is required/i);

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('does not insert when the zone is not on this farm', async () => {
    zoneFound = false;

    await expect(
      createObservation({
        zoneId: ZONE_ID,
        body: 'Aphids in the cabbage',
        observedOn,
      })
    ).rejects.toThrow(/zone not found/i);

    expect(mockInsert).not.toHaveBeenCalled();
    expectSameParams(
      capturedWheres[0],
      and(eq(managementZone.id, ZONE_ID), eq(managementZone.farmId, FARM_ID))
    );
  });

  it('stores a trimmed note for a zone on this farm', async () => {
    await createObservation({
      zoneId: ZONE_ID,
      body: '  Aphids in the cabbage  ',
      observedOn,
    });

    expectSameParams(
      capturedWheres[0],
      and(eq(managementZone.id, ZONE_ID), eq(managementZone.farmId, FARM_ID))
    );
    expect(capturedInsert.value).toMatchObject({
      managementZoneId: ZONE_ID,
      userId: USER_ID,
      body: 'Aphids in the cabbage',
      observedOn: new Date(Date.UTC(2026, 2, 20)),
    });
  });
});

describe('updateObservation', () => {
  it('rejects an empty note before writing', async () => {
    await expect(
      updateObservation(11, {
        body: ' ',
        observedOn: new Date(Date.UTC(2026, 3, 8)),
      })
    ).rejects.toThrow(/required/i);

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('does not update an observation outside this farm', async () => {
    zoneFound = false;

    await expect(
      updateObservation(11, {
        body: 'Updated note',
        observedOn: new Date(Date.UTC(2026, 3, 8)),
      })
    ).rejects.toThrow(/not found/i);

    expect(mockUpdate).not.toHaveBeenCalled();
    expectSameParams(
      capturedWheres[0],
      and(
        eq(managementZoneObservation.id, 11),
        eq(managementZone.farmId, FARM_ID)
      )
    );
  });

  it('updates a note on this farm', async () => {
    const observedOn = new Date(Date.UTC(2026, 3, 8, 8));

    await updateObservation(11, { body: '  Updated note  ', observedOn });

    expectSameParams(
      capturedWheres[0],
      and(
        eq(managementZoneObservation.id, 11),
        eq(managementZone.farmId, FARM_ID)
      )
    );
    expect(capturedUpdate.value).toMatchObject({
      body: 'Updated note',
      userId: USER_ID,
      observedOn: new Date(Date.UTC(2026, 3, 8)),
    });
  });
});

describe('deleteObservation', () => {
  it('rejects an invalid id before reading', async () => {
    await expect(deleteObservation(0)).rejects.toThrow(/invalid/i);
    expect(mockSelect).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('does not delete an observation outside this farm', async () => {
    zoneFound = false;

    await expect(deleteObservation(13)).rejects.toThrow(/not found/i);
    expect(mockDelete).not.toHaveBeenCalled();
    expectSameParams(
      capturedWheres[0],
      and(
        eq(managementZoneObservation.id, 13),
        eq(managementZone.farmId, FARM_ID)
      )
    );
  });

  it('deletes an observation on this farm', async () => {
    await deleteObservation(13);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expectSameParams(
      capturedWheres[0],
      and(
        eq(managementZoneObservation.id, 13),
        eq(managementZone.farmId, FARM_ID)
      )
    );
  });
});
