// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { analysis, formSubmission, managementZone } from '../schema';

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
  lock: vi.fn(),
}));
vi.mock('../schema/connection', () => ({
  db: { transaction: mocks.transaction },
}));
import {
  advanceManagementZoneRequest,
  createManagementZoneRequest,
} from './management-zone-requests';

const answers = {
  name: 'North field',
  location: 'West of barn',
  acreage: 12,
  zoneId: 7,
  requestedByUserId: 3,
  stage: 'requested',
};
let selectRows: unknown[][];
let insertRows: unknown[][];
let insertValues: unknown[];

beforeEach(() => {
  vi.clearAllMocks();
  selectRows = [{ id: 5, farmId: 2, answers: { ...answers } }, { id: 7 }].map(
    (row) => [row]
  );
  insertRows = [[{ id: 7 }], [{ id: 5 }]];
  insertValues = [];
  mocks.insert.mockImplementation(() => ({
    values: (value: unknown) => {
      insertValues.push(value);
      return { returning: async () => insertRows.shift() };
    },
  }));
  mocks.select.mockImplementation(() => ({
    from: () => ({
      where: () => ({
        limit: () => {
          const rows = selectRows.shift() ?? [];
          const promise = Promise.resolve(rows) as Promise<unknown[]> & {
            for: typeof mocks.lock;
          };
          promise.for = mocks.lock.mockImplementation(() =>
            Promise.resolve(rows)
          );
          return promise;
        },
      }),
    }),
  }));
  mocks.set.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
  mocks.update.mockReturnValue({ set: mocks.set });
  mocks.transaction.mockImplementation(async (callback) =>
    callback({
      insert: mocks.insert,
      select: mocks.select,
      update: mocks.update,
    })
  );
});

describe('creating a management zone request', () => {
  it('uses an atomic transaction with only session identity and client parcel details', async () => {
    expect(
      await createManagementZoneRequest({ id: 3, farmId: 2 }, {
        ...answers,
        farmId: 99,
        stage: 'processed',
        approved: true,
      } as never)
    ).toEqual({ id: 5, zoneId: 7 });
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.insert.mock.calls.map(([table]) => table)).toEqual([
      managementZone,
      formSubmission,
    ]);
    expect(insertValues).toEqual([
      { farmId: 2, name: 'North field' },
      {
        formSlug: 'management-zone-request',
        workflowType: 'generic',
        status: null,
        farmId: 2,
        retentionConsent: false,
        answers,
      },
    ]);
  });
  it('rejects invalid details before starting a transaction', async () => {
    await expect(
      createManagementZoneRequest(
        { id: 3, farmId: 2 },
        { name: '', location: '' }
      )
    ).rejects.toThrow();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it('propagates submission errors to roll back the enclosing transaction', async () => {
    mocks.insert
      .mockImplementationOnce(() => ({
        values: () => ({ returning: async () => [{ id: 7 }] }),
      }))
      .mockImplementationOnce(() => ({
        values: () => ({
          returning: async () => {
            throw new Error('write failed');
          },
        }),
      }));
    await expect(
      createManagementZoneRequest({ id: 3, farmId: 2 }, answers)
    ).rejects.toThrow('write failed');
  });
});

describe('staff request progress', () => {
  it('locks the request and records shipment with the staff identity', async () => {
    await advanceManagementZoneRequest(5, 'sample_kit_sent', 9);
    expect(mocks.lock).toHaveBeenCalledWith('update');
    expect(mocks.update).toHaveBeenCalledWith(formSubmission);
    expect(mocks.set).toHaveBeenCalledWith(
      expect.objectContaining({
        reviewedByInternalAccountId: 9,
        reviewedAt: expect.any(Date),
        answers: {
          ...answers,
          stage: 'sample_kit_sent',
          sampleKitSentAt: expect.any(String),
        },
      })
    );
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it('requires an analysis before recording processed', async () => {
    selectRows = [
      [{ id: 5, farmId: 2, answers: { ...answers, stage: 'sample_kit_sent' } }],
      [{ id: 7 }],
      [],
    ];
    await expect(
      advanceManagementZoneRequest(5, 'processed', 9)
    ).rejects.toThrow('Add the soil analysis');
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it('records processing only after shipment and an existing analysis', async () => {
    selectRows = [
      [
        {
          id: 5,
          farmId: 2,
          answers: {
            ...answers,
            stage: 'sample_kit_sent',
            sampleKitSentAt: '2026-01-01T00:00:00.000Z',
          },
        },
      ],
      [{ id: 7 }],
      [{ id: 'analysis-7' }],
    ];
    await advanceManagementZoneRequest(5, 'processed', 9);
    expect(mocks.set).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: expect.objectContaining({
          stage: 'processed',
          processedAt: expect.any(String),
        }),
      })
    );
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalledWith(managementZone);
    expect(mocks.update).not.toHaveBeenCalledWith(analysis);
  });
  it.each(['requested', 'processed'])(
    'rejects processing from %s',
    async (stage) => {
      selectRows[0] = [{ id: 5, farmId: 2, answers: { ...answers, stage } }];
      await expect(
        advanceManagementZoneRequest(5, 'processed', 9)
      ).rejects.toThrow('Record the sample kit');
      expect(mocks.update).not.toHaveBeenCalled();
    }
  );
  it('rejects a deleted or unrelated request', async () => {
    selectRows[0] = [];
    await expect(
      advanceManagementZoneRequest(5, 'sample_kit_sent', 9)
    ).rejects.toThrow('Request not found');
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it('rejects a zone that no longer belongs to the recorded farm', async () => {
    selectRows[1] = [];
    await expect(
      advanceManagementZoneRequest(5, 'sample_kit_sent', 9)
    ).rejects.toThrow('no longer belongs');
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it.each([
    [0, 'processed'],
    [5, 'approved'],
  ])('rejects forged ids or steps %#', async (id, step) => {
    await expect(
      advanceManagementZoneRequest(id as number, step as never, 9)
    ).rejects.toThrow();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
});
