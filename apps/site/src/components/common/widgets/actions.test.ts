// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  createWidget,
  deleteWidget,
  updateWidget,
} from '@/components/common/widgets/actions';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockDelete,
  mockDeleteWhere,
  mockGetAuthenticatedInfo,
  mockInsert,
  mockInsertReturning,
  mockInsertValues,
  mockLoggerError,
  mockLoggerWarn,
  mockRevalidatePath,
  mockUpdate,
  mockUpdateSet,
  mockUpdateWhere,
} = vi.hoisted(() => {
  const mockInsertReturning = vi.fn();
  const mockInsertValues = vi.fn(() => ({
    returning: mockInsertReturning,
  }));
  const mockInsert = vi.fn(() => ({
    values: mockInsertValues,
  }));

  const mockDeleteWhere = vi.fn();
  const mockDelete = vi.fn(() => ({
    where: mockDeleteWhere,
  }));

  const mockUpdateWhere = vi.fn();
  const mockUpdateSet = vi.fn(() => ({
    where: mockUpdateWhere,
  }));
  const mockUpdate = vi.fn(() => ({
    set: mockUpdateSet,
  }));

  return {
    mockDelete,
    mockDeleteWhere,
    mockGetAuthenticatedInfo: vi.fn(),
    mockInsert,
    mockInsertReturning,
    mockInsertValues,
    mockLoggerError: vi.fn(),
    mockLoggerWarn: vi.fn(),
    mockRevalidatePath: vi.fn(),
    mockUpdate,
    mockUpdateSet,
    mockUpdateWhere,
  };
});

vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: {
    insert: mockInsert,
    delete: mockDelete,
    update: mockUpdate,
  },
}));

vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: mockGetAuthenticatedInfo,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

vi.mock('@/lib/logger', () => ({
  default: {
    error: mockLoggerError,
    warn: mockLoggerWarn,
  },
}));

describe('widgets actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuthenticatedInfo.mockResolvedValue({
      id: 1,
      farmId: 1,
      role: 'Admin',
    });
    mockInsertReturning.mockResolvedValue([{ id: 123 }]);
    mockDeleteWhere.mockResolvedValue(undefined);
    mockUpdateWhere.mockResolvedValue(undefined);
  });

  it('revalidates the dashboard after creating a widget', async () => {
    const result = await createWidget({
      managementZoneId: 7,
      name: 'Macro Radar',
    });

    expect(result).toEqual({ data: { widgetId: 123 } });
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
  });

  it('revalidates the dashboard after deleting a widget', async () => {
    const result = await deleteWidget(42);

    expect(result).toEqual({});
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
  });

  it('revalidates the dashboard after updating a widget', async () => {
    const result = await updateWidget(7, 'Macro Radar', {
      widgetMetadata: {
        i: 'Macro Radar',
        x: 0,
        y: 1,
      },
    });

    expect(result).toEqual({});
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
  });
});
