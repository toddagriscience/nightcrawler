// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SQL } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import {
  farm,
  farmSubscription,
  formSubmission,
  user,
} from '@nightcrawler/db/schema';
import { ONBOARDING_DATA } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import {
  getOnboardingAccount,
  getOnboardingTeam,
} from '@/app/(onboarding)/apply/db';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasCompletedPlatformOnboarding } from '@/lib/utils/platform-onboarding';
import { logger } from '@/lib/logger';

const { select, getUser, getClaims, rpc } = vi.hoisted(() => ({
  select: vi.fn(),
  getUser: vi.fn(),
  getClaims: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock('@nightcrawler/db/schema/connection', () => ({ db: { select } }));
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: vi.fn(),
}));
vi.mock('@/lib/utils/platform-onboarding', () => ({
  hasCompletedPlatformOnboarding: vi.fn(),
}));
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser, getClaims }, rpc }),
}));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));

const applicant = { ...ONBOARDING_DATA.currentUser, farmId: 1 };
const approvedSubmission = {
  id: 42,
  answers: { email: applicant.email },
  signedUpAt: new Date('2026-09-01T12:00:00Z'),
};

let queryRows: unknown[][];
let queries: Array<{ table: unknown; sql: string; params: unknown[] }>;

beforeEach(() => {
  vi.resetAllMocks();
  queryRows = [[approvedSubmission], []];
  queries = [];
  vi.mocked(getAuthenticatedInfo).mockResolvedValue(applicant);
  vi.mocked(hasCompletedPlatformOnboarding).mockResolvedValue(false);
  getUser.mockResolvedValue({
    data: { user: { email: applicant.email, user_metadata: {} } },
    error: null,
  });
  rpc.mockResolvedValue({ data: null, error: null });
  select.mockImplementation(() => ({
    from: (table: unknown) => ({
      where: (condition: SQL) => {
        const query = new PgDialect({ casing: 'snake_case' }).sqlToQuery(
          condition
        );
        queries.push({ table, sql: query.sql, params: query.params });
        const rows = queryRows.shift() ?? [];
        return Object.assign(Promise.resolve(rows), {
          limit: async (count: number) => rows.slice(0, count),
        });
      },
    }),
  }));
});

describe('getOnboardingAccount', () => {
  it('requires a stored completed application instead of trusting applicant metadata', async () => {
    queryRows = [[], []];
    getUser.mockResolvedValue({
      data: {
        user: {
          email: applicant.email,
          user_metadata: {
            onboarding_applicant: true,
            onboarding_application_id: 42,
            onboarding_password_set: true,
          },
        },
      },
      error: null,
    });

    const account = await getOnboardingAccount();

    expect(account.isApplicant).toBe(false);
  });

  it('scopes approved applications and payment information to the current farm', async () => {
    vi.mocked(getAuthenticatedInfo).mockResolvedValue({
      ...applicant,
      farmId: 73,
    });

    const account = await getOnboardingAccount();

    expect(account.isApplicant).toBe(true);
    const applicationQuery = queries.find(
      (query) => query.table === formSubmission
    );
    expect(applicationQuery?.sql).toContain(
      '"form_submissions"."farm_id" = $1'
    );
    expect(applicationQuery?.sql).toContain(
      '"form_submissions"."workflow_type" = $2'
    );
    expect(applicationQuery?.sql).toContain('"form_submissions"."status" = $3');
    expect(applicationQuery?.sql).toContain(
      '"form_submissions"."deleted_at" is null'
    );
    expect(applicationQuery?.params).toEqual([
      73,
      'platform_access',
      'approved',
    ]);
    const subscriptionQuery = queries.find(
      (query) => query.table === farmSubscription
    );
    expect(subscriptionQuery?.sql).toContain(
      '"farm_subscription"."farm_id" = $1'
    );
    expect(subscriptionQuery?.params).toEqual([73]);
  });

  it.each([
    {
      name: 'another email',
      answers: { email: 'other@example.com' },
      signedUpAt: approvedSubmission.signedUpAt,
    },
    {
      name: 'no applicant email',
      answers: {},
      signedUpAt: approvedSubmission.signedUpAt,
    },
    {
      name: 'an unfinished signup',
      answers: approvedSubmission.answers,
      signedUpAt: null,
    },
  ])('rejects an application with $name', async ({ answers, signedUpAt }) => {
    queryRows = [[{ ...approvedSubmission, answers, signedUpAt }], []];

    const account = await getOnboardingAccount();

    expect(account.isApplicant).toBe(false);
    expect(account.state.passwordSet).toBe(false);
  });

  it('matches stored applicant email without depending on capitalization', async () => {
    queryRows = [
      [
        {
          ...approvedSubmission,
          answers: { email: applicant.email.toUpperCase() },
        },
      ],
      [],
    ];

    expect((await getOnboardingAccount()).isApplicant).toBe(true);
  });

  it('keeps a Viewer out of the main-applicant flow even with matching application data', async () => {
    vi.mocked(getAuthenticatedInfo).mockResolvedValue({
      ...applicant,
      role: 'Viewer',
    });

    expect((await getOnboardingAccount()).isApplicant).toBe(false);
  });

  it('resumes a legacy completed signup after password when progress markers are absent', async () => {
    const account = await getOnboardingAccount();

    expect(account.isApplicant).toBe(true);
    expect(account.subscription).toBeNull();
    expect(account.state).toEqual({
      passwordSet: true,
      teamStepDone: false,
      bankReady: false,
      paymentContinued: false,
      termsAccepted: false,
    });
    expect(hasCompletedPlatformOnboarding).toHaveBeenCalledWith(
      applicant.id,
      false
    );
  });

  it('keeps an explicit incomplete-password marker incomplete for an existing applicant', async () => {
    getUser.mockResolvedValue({
      data: {
        user: {
          email: applicant.email,
          user_metadata: { onboarding_password_set: false },
        },
      },
      error: null,
    });

    expect((await getOnboardingAccount()).state.passwordSet).toBe(false);
  });

  it('reads changed progress from fresh auth user data without using cached claims', async () => {
    getUser.mockResolvedValue({
      data: {
        user: {
          email: applicant.email,
          user_metadata: {
            onboarding_password_set: true,
            onboarding_team_step_done: false,
            onboarding_payment_continued: false,
          },
        },
      },
      error: null,
    });
    const initial = await getOnboardingAccount();
    queryRows = [
      [approvedSubmission],
      [{ farmId: 1, status: 'bank_setup_complete' }],
    ];
    getUser.mockResolvedValue({
      data: {
        user: {
          email: applicant.email,
          user_metadata: {
            onboarding_password_set: true,
            onboarding_team_step_done: true,
            onboarding_payment_continued: true,
          },
        },
      },
      error: null,
    });

    const resumed = await getOnboardingAccount();

    expect(initial.state.paymentContinued).toBe(false);
    expect(resumed.state).toMatchObject({
      passwordSet: true,
      teamStepDone: true,
      paymentContinued: true,
      bankReady: true,
    });
    expect(getUser).toHaveBeenCalledTimes(2);
    expect(getClaims).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'missing user', authUser: null, error: null },
    { name: 'missing email', authUser: { user_metadata: {} }, error: null },
    {
      name: 'different email',
      authUser: { email: 'other@example.com', user_metadata: {} },
      error: null,
    },
    {
      name: 'auth error',
      authUser: { email: applicant.email, user_metadata: {} },
      error: new Error('Auth unavailable'),
    },
  ])('rejects $name before querying farm data', async ({ authUser, error }) => {
    getUser.mockResolvedValue({ data: { user: authUser }, error });

    await expect(getOnboardingAccount()).rejects.toThrow(
      'Please sign in again'
    );

    expect(select).not.toHaveBeenCalled();
    expect(hasCompletedPlatformOnboarding).not.toHaveBeenCalled();
  });
});

describe('getOnboardingTeam', () => {
  it('loads farm teammates and checks invitation verification by email', async () => {
    const teammates = [
      { ...applicant, id: 2, email: 'sam@example.com', role: 'Viewer' },
      { ...applicant, id: 3, email: 'jo@example.com', role: 'Viewer' },
    ];
    queryRows = [[{ informalName: 'Rivera Farm' }], teammates];
    rpc.mockResolvedValueOnce({ data: '2026-09-01T12:00:00Z', error: null });
    rpc.mockResolvedValueOnce({ data: null, error: null });

    const team = await getOnboardingTeam(applicant);

    expect(team.farmInfo).toEqual({ farmId: 1, informalName: 'Rivera Farm' });
    expect(team.allUsers).toEqual(teammates);
    expect(team.invitedUserVerificationStatus).toEqual([
      { email: 'sam@example.com', verified: true },
      { email: 'jo@example.com', verified: false },
    ]);
    expect(rpc).toHaveBeenCalledWith('get_email_verification_from_email', {
      email_address: 'sam@example.com',
    });
    expect(rpc).toHaveBeenCalledWith('get_email_verification_from_email', {
      email_address: 'jo@example.com',
    });
    const farmQuery = queries.find((query) => query.table === farm);
    expect(farmQuery?.params).toEqual([1]);
    const teammateQuery = queries.find((query) => query.table === user);
    expect(teammateQuery?.sql).toContain('"user"."farm_id" = $1');
    expect(teammateQuery?.sql).toContain('"user"."id" <> $2');
    expect(teammateQuery?.params).toEqual([1, applicant.id]);
  });

  it('reports failed verification lookups as unverified and logs the failure', async () => {
    queryRows = [[], [{ ...applicant, id: 2, email: 'sam@example.com' }]];
    const error = new Error('Verification unavailable');
    rpc.mockResolvedValue({ data: 'unexpected-value', error });

    const team = await getOnboardingTeam(applicant);

    expect(team.farmInfo).toEqual({ farmId: 1, informalName: undefined });
    expect(team.invitedUserVerificationStatus).toEqual([
      { email: 'sam@example.com', verified: false },
    ]);
    expect(logger.error).toHaveBeenCalledWith(
      'Unable to read invitation verification status',
      error
    );
  });

  it('returns an empty invitation list without contacting the verification service', async () => {
    queryRows = [[{ informalName: 'Rivera Farm' }], []];

    const team = await getOnboardingTeam(applicant);

    expect(team.allUsers).toEqual([]);
    expect(team.invitedUserVerificationStatus).toEqual([]);
    expect(rpc).not.toHaveBeenCalled();
  });
});
