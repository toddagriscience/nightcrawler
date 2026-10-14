// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import { user } from '@nightcrawler/db/schema';
import { ONBOARDING_DATA } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import {
  resendVerificationEmail,
  uninviteUser,
} from '@/app/(onboarding)/apply/components/colleagues/actions';
import { requireOnboardingStep } from '@/app/(onboarding)/apply/onboarding-access';
import { deleteAuthUserByEmail, resendEmailInvite } from '@/lib/auth-server';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';

const { select, from, selectWhere, limit, deleteRows, deleteWhere } =
  vi.hoisted(() => ({
    select: vi.fn(),
    from: vi.fn(),
    selectWhere: vi.fn(),
    limit: vi.fn(),
    deleteRows: vi.fn(),
    deleteWhere: vi.fn(),
  }));

vi.mock('@nightcrawler/db/schema/connection', () => ({
  db: { select, delete: deleteRows },
}));
vi.mock('@/lib/auth-server', () => ({
  resendEmailInvite: vi.fn(),
  deleteAuthUserByEmail: vi.fn(),
}));
vi.mock('@/lib/utils/get-authenticated-info', () => ({
  getAuthenticatedInfo: vi.fn(),
}));
vi.mock('@/app/(onboarding)/apply/onboarding-access', () => ({
  requireOnboardingStep: vi.fn(),
}));
vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn() },
  default: { error: vi.fn(), warn: vi.fn() },
}));

const teammate = {
  ...ONBOARDING_DATA.currentUser,
  id: 2,
  email: 'teammate@example.com',
};
const dialect = new PgDialect({ casing: 'snake_case' });

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getAuthenticatedInfo).mockResolvedValue({
    ...ONBOARDING_DATA.currentUser,
  });
  vi.mocked(requireOnboardingStep).mockResolvedValue({
    currentUser: { ...ONBOARDING_DATA.currentUser },
    subscription: null,
    isApplicant: true,
    state: {
      passwordSet: true,
      teamStepDone: false,
      bankReady: false,
      paymentContinued: false,
      termsAccepted: false,
    },
  });
  select.mockReturnValue({ from });
  from.mockReturnValue({ where: selectWhere });
  selectWhere.mockReturnValue({ limit });
  limit.mockResolvedValue([teammate]);
  deleteRows.mockReturnValue({ where: deleteWhere });
  deleteWhere.mockResolvedValue(undefined);
  vi.mocked(resendEmailInvite).mockResolvedValue({ user: null, session: null });
  vi.mocked(deleteAuthUserByEmail).mockResolvedValue(null);
});

describe('onboarding invitation actions', () => {
  it('resends an existing invitation only within the current farm and team step', async () => {
    await expect(resendVerificationEmail(teammate.email)).resolves.toEqual({});
    expect(requireOnboardingStep).toHaveBeenCalledWith('team');
    expect(from).toHaveBeenCalledWith(user);
    const query = dialect.sqlToQuery(selectWhere.mock.calls[0][0]);
    expect(query.params).toEqual([
      teammate.email,
      ONBOARDING_DATA.currentUser.farmId,
    ]);
    expect(query.sql).toContain(' and ');
    expect(query.sql).toContain('"user"."farm_id"');
    expect(resendEmailInvite).toHaveBeenCalledExactlyOnceWith(teammate.email);
  });

  it('propagates a returned authentication error instead of reporting resend success', async () => {
    vi.mocked(resendEmailInvite).mockResolvedValue(
      new Error('Email rate limit exceeded')
    );
    await expect(resendVerificationEmail(teammate.email)).rejects.toThrow(
      'Email rate limit exceeded'
    );
    expect(deleteRows).not.toHaveBeenCalled();
  });

  it('propagates a thrown resend failure', async () => {
    vi.mocked(resendEmailInvite).mockRejectedValue(
      new Error('Invitation service unavailable')
    );
    await expect(resendVerificationEmail(teammate.email)).rejects.toThrow(
      'Invitation service unavailable'
    );
  });

  it('does not send invitations to addresses outside the current farm', async () => {
    limit.mockResolvedValue([]);
    await expect(
      resendVerificationEmail('another-farm@example.com')
    ).rejects.toThrow('This invitation does not belong to your farm');
    const query = dialect.sqlToQuery(selectWhere.mock.calls[0][0]);
    expect(query.params).toEqual([
      'another-farm@example.com',
      ONBOARDING_DATA.currentUser.farmId,
    ]);
    expect(query.sql).toContain(' and ');
    expect(resendEmailInvite).not.toHaveBeenCalled();
  });

  it.each([
    {
      name: 'resending',
      action: () => resendVerificationEmail(teammate.email),
    },
    { name: 'uninviting', action: () => uninviteUser(teammate.id) },
  ])(
    'blocks $name when onboarding progress has locked the team step',
    async ({ action }) => {
      vi.mocked(requireOnboardingStep).mockRejectedValue(
        new Error('This onboarding step is no longer available')
      );
      await expect(action()).rejects.toThrow(
        'This onboarding step is no longer available'
      );
      expect(requireOnboardingStep).toHaveBeenCalledExactlyOnceWith('team');
      expect(select).not.toHaveBeenCalled();
      expect(resendEmailInvite).not.toHaveBeenCalled();
      expect(deleteAuthUserByEmail).not.toHaveBeenCalled();
      expect(deleteRows).not.toHaveBeenCalled();
    }
  );

  it.each([
    {
      name: 'resending',
      action: () => resendVerificationEmail(teammate.email),
    },
    { name: 'uninviting', action: () => uninviteUser(teammate.id) },
  ])(
    'rejects viewers before $name or looking up another user',
    async ({ action }) => {
      vi.mocked(getAuthenticatedInfo).mockResolvedValue({
        ...ONBOARDING_DATA.currentUser,
        role: 'Viewer',
      });
      await expect(action()).rejects.toThrow('You do not have permission');
      expect(requireOnboardingStep).not.toHaveBeenCalled();
      expect(select).not.toHaveBeenCalled();
      expect(resendEmailInvite).not.toHaveBeenCalled();
      expect(deleteAuthUserByEmail).not.toHaveBeenCalled();
    }
  );

  it('rejects removing the current applicant', async () => {
    limit.mockResolvedValue([ONBOARDING_DATA.currentUser]);
    await expect(uninviteUser(ONBOARDING_DATA.currentUser.id)).rejects.toThrow(
      'You cannot uninvite yourself'
    );
    expect(deleteAuthUserByEmail).not.toHaveBeenCalled();
    expect(deleteRows).not.toHaveBeenCalled();
  });

  it('rejects removing a user outside the current farm', async () => {
    limit.mockResolvedValue([]);
    await expect(uninviteUser(99)).rejects.toThrow(
      'User not found or you cannot uninvite this user'
    );
    const query = dialect.sqlToQuery(selectWhere.mock.calls[0][0]);
    expect(query.params).toEqual([99, ONBOARDING_DATA.currentUser.farmId]);
    expect(query.sql).toContain(' and ');
    expect(query.sql).toContain('"user"."farm_id"');
    expect(deleteAuthUserByEmail).not.toHaveBeenCalled();
    expect(deleteRows).not.toHaveBeenCalled();
  });

  it('preserves the invitation row when removing the auth account fails', async () => {
    vi.mocked(deleteAuthUserByEmail).mockResolvedValue(
      new Error('Unable to remove account')
    );
    await expect(uninviteUser(teammate.id)).rejects.toThrow(
      'Unable to remove account'
    );
    expect(deleteRows).not.toHaveBeenCalled();
  });

  it('removes a teammate only after successful auth removal', async () => {
    await expect(uninviteUser(teammate.id)).resolves.toEqual({});
    expect(requireOnboardingStep).toHaveBeenCalledExactlyOnceWith('team');
    expect(deleteAuthUserByEmail).toHaveBeenCalledExactlyOnceWith(
      teammate.email
    );
    expect(deleteRows).toHaveBeenCalledExactlyOnceWith(user);
    expect(dialect.sqlToQuery(deleteWhere.mock.calls[0][0]).params).toEqual([
      teammate.id,
    ]);
    expect(
      vi.mocked(deleteAuthUserByEmail).mock.invocationCallOrder[0]
    ).toBeLessThan(deleteRows.mock.invocationCallOrder[0]);
  });
});
