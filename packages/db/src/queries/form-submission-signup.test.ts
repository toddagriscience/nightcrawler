// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';

const hydrateFarmFromFormSubmission = vi.fn();
const loggerError = vi.fn();
const selectMock = vi.fn();
const updateMock = vi.fn();

/** Submission row returned by the pre-update SELECT. */
const submissionRow = {
  formSlug: 'iris-access',
  workflowType: 'platform_access',
  answers: { totalAcreage: 'around 120' },
};

/** Queued rows for each UPDATE ... RETURNING call (one queue entry per concurrent signup). */
let returningQueues: { id: number }[][];

/**
 * Builds a mock Drizzle select chain ending in `limit`.
 *
 * @param rows - Rows the select should resolve with
 */
function buildSelectChain(rows: unknown[]) {
  return {
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(rows),
      }),
    }),
  };
}

/** Builds a mock Drizzle update chain with a `returning` handler driven by `returningQueues`. */
function buildUpdateChain() {
  return {
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockImplementation(async () => {
          const next = returningQueues.shift();
          return next ?? [];
        }),
      }),
    }),
  };
}

vi.mock('../utils/hydrate-farm-from-form-submission', () => ({
  hydrateFarmFromFormSubmission: (
    ...args: Parameters<typeof hydrateFarmFromFormSubmission>
  ) => hydrateFarmFromFormSubmission(...args),
}));

vi.mock('../utils/logger', () => ({
  logger: {
    error: (...args: unknown[]) => loggerError(...args),
  },
}));

vi.mock('../schema/connection', () => ({
  db: {
    select: (...args: unknown[]) => selectMock(...args),
    update: (...args: unknown[]) => updateMock(...args),
  },
}));

import {
  completeFormSubmissionSignup,
  isFormSubmissionSignupLinkConsumed,
  resolveSignupContext,
} from './form-submission-signup';

describe('completeFormSubmissionSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    returningQueues = [[{ id: 7 }]];
    selectMock.mockReturnValue(buildSelectChain([submissionRow]));
    updateMock.mockReturnValue(buildUpdateChain());
    hydrateFarmFromFormSubmission.mockResolvedValue(undefined);
  });

  it('does not throw when hydration fails after the token is consumed', async () => {
    hydrateFarmFromFormSubmission.mockRejectedValue(
      new Error('invalid input syntax for type integer')
    );

    await expect(completeFormSubmissionSignup(7, 8)).resolves.toBeUndefined();

    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(hydrateFarmFromFormSubmission).toHaveBeenCalledTimes(1);
    expect(loggerError).toHaveBeenCalledTimes(1);
  });

  it('hydrates only once when two concurrent signups race', async () => {
    returningQueues = [[{ id: 7 }], []];

    await Promise.all([
      completeFormSubmissionSignup(7, 8),
      completeFormSubmissionSignup(7, 8),
    ]);

    expect(updateMock).toHaveBeenCalledTimes(2);
    expect(hydrateFarmFromFormSubmission).toHaveBeenCalledTimes(1);
  });

  it('skips hydration when the signup token was already consumed', async () => {
    returningQueues = [[]];

    await completeFormSubmissionSignup(7, 8);

    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(hydrateFarmFromFormSubmission).not.toHaveBeenCalled();
  });
});

/**
 * `signupToken` is a `uuid` column and `id` a `serial`, so Postgres aborts the
 * statement on a malformed literal instead of matching no rows. A mangled
 * approval link must therefore be rejected before it reaches the database, or
 * it surfaces as a server error rather than the expired-link screen.
 */
describe('malformed signup links', () => {
  const VALID_TOKEN = '8abd4716-bfcc-4417-8e91-a68f1f435fc4';

  beforeEach(() => {
    selectMock.mockReset();
  });

  it.each([
    ['a token that is not a uuid', 4, 'totally-bogus-token'],
    ['a truncated token', 4, '8abd4716-bfcc-4417'],
    ['an empty token', 4, '   '],
    ['an id beyond int4', 2_147_483_648, VALID_TOKEN],
    ['a fractional id', 4.5, VALID_TOKEN],
    ['a negative id', -1, VALID_TOKEN],
  ])(
    'resolveSignupContext returns null for %s without querying',
    async (_label, submissionId, token) => {
      await expect(
        resolveSignupContext(submissionId, token)
      ).resolves.toBeNull();

      expect(selectMock).not.toHaveBeenCalled();
    }
  );

  it('isFormSubmissionSignupLinkConsumed returns false for a non-uuid token without querying', async () => {
    await expect(
      isFormSubmissionSignupLinkConsumed(4, 'totally-bogus-token')
    ).resolves.toBe(false);

    expect(selectMock).not.toHaveBeenCalled();
  });

  it('still queries for a well-formed link', async () => {
    selectMock.mockReturnValue(buildSelectChain([]));

    await expect(resolveSignupContext(4, VALID_TOKEN)).resolves.toBeNull();

    expect(selectMock).toHaveBeenCalledTimes(1);
  });
});
