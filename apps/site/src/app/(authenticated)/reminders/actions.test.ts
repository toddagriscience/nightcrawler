// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { and, eq } from 'drizzle-orm';
import { reminder } from '@nightcrawler/db/schema/reminder';

/**
 * These tests verify the reminder mutation server actions are scoped to the
 * authenticated owner (IDOR protection). Rather than spin up a real database,
 * we mock the drizzle query builder and capture the `.where(...)` argument,
 * then assert it equals `and(eq(reminder.id, id), eq(reminder.userId, userId))`.
 */

const CURRENT_USER_ID = 4242;

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

// Capture the WHERE condition passed to each mutation's terminal builder.
const capturedWhere: { value: unknown } = { value: undefined };

const { mockDelete, mockUpdate } = vi.hoisted(() => {
  return {
    mockDelete: vi.fn(),
    mockUpdate: vi.fn(),
  };
});

vi.mock('@nightcrawler/db/schema/connection', () => {
  return {
    db: {
      delete: mockDelete,
      update: mockUpdate,
    },
  };
});

import {
  deleteReminder,
  markReminderRead,
  updateReminder,
  updateReminderById,
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
 * Asserts the captured WHERE is owner-scoped: it must bind BOTH the reminder
 * id and the authenticated user's id. We compare the captured condition's bound
 * params against a freshly-built `and(eq(id), eq(userId))` reference, so the
 * test fails if either the id or the userId scoping is dropped.
 */
function expectOwnerScopedWhere(captured: unknown, id: number) {
  const expected = and(
    eq(reminder.id, id),
    eq(reminder.userId, CURRENT_USER_ID)
  );

  const capturedParams = collectParamValues(captured);
  const expectedParams = collectParamValues(expected);

  // Owner scoping must be present.
  expect(capturedParams).toContain(CURRENT_USER_ID);
  expect(capturedParams).toContain(id);
  // And the full bound-param set must match the owner-scoped reference exactly.
  expect([...capturedParams].sort()).toEqual([...expectedParams].sort());
}

beforeEach(() => {
  vi.clearAllMocks();
  capturedWhere.value = undefined;
  mockGetAuthenticatedInfo.mockResolvedValue({ id: CURRENT_USER_ID });

  // delete().where(cond)
  mockDelete.mockReturnValue({
    where: (cond: unknown) => {
      capturedWhere.value = cond;
      return Promise.resolve(undefined);
    },
  });

  // update().set(data).where(cond)
  mockUpdate.mockReturnValue({
    set: () => ({
      where: (cond: unknown) => {
        capturedWhere.value = cond;
        return Promise.resolve(undefined);
      },
    }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('updateReminder (FormData action)', () => {
  function makeFormData(id: string, action: string): FormData {
    const fd = new FormData();
    fd.set('id', id);
    fd.set('action', action);
    return fd;
  }

  it('authenticates and scopes the dismiss delete to the owner', async () => {
    await updateReminder(makeFormData('7', 'dismiss'));

    expect(mockGetAuthenticatedInfo).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expectOwnerScopedWhere(capturedWhere.value, 7);
  });

  it('authenticates and scopes the mark_read update to the owner', async () => {
    await updateReminder(makeFormData('9', 'mark_read'));

    expect(mockGetAuthenticatedInfo).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expectOwnerScopedWhere(capturedWhere.value, 9);
  });

  it('rejects an invalid (non-integer) id without touching the db', async () => {
    await expect(
      updateReminder(makeFormData('not-a-number', 'dismiss'))
    ).rejects.toThrow();
    expect(mockDelete).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('updateReminderById', () => {
  it('scopes the update to the authenticated owner', async () => {
    await updateReminderById(11, { title: 'Updated' });

    expect(mockGetAuthenticatedInfo).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expectOwnerScopedWhere(capturedWhere.value, 11);
  });
});

describe('deleteReminder', () => {
  it('scopes the delete to the authenticated owner', async () => {
    await deleteReminder(13);

    expect(mockGetAuthenticatedInfo).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expectOwnerScopedWhere(capturedWhere.value, 13);
  });
});

describe('markReminderRead', () => {
  it('scopes the update to the authenticated owner', async () => {
    await markReminderRead(15);

    expect(mockGetAuthenticatedInfo).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expectOwnerScopedWhere(capturedWhere.value, 15);
  });
});
