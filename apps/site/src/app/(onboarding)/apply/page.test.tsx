// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Apply from '@/app/(onboarding)/apply/page';
import { ONBOARDING_DATA } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { OnboardingFlowProps } from '@/app/(onboarding)/apply/types';

const {
  getUserEmail,
  resolveSignupContext,
  alreadyCompleted,
  linkConsumed,
  getAccount,
  getTeam,
  getUser,
} = vi.hoisted(() => ({
  getUserEmail: vi.fn(),
  resolveSignupContext: vi.fn(),
  alreadyCompleted: vi.fn(),
  linkConsumed: vi.fn(),
  getAccount: vi.fn(),
  getTeam: vi.fn(),
  getUser: vi.fn(),
}));
vi.mock('@/lib/auth-server', () => ({ getUserEmail }));
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser } }),
}));
vi.mock('@nightcrawler/db/queries', () => ({
  resolveSignupContext,
  isFormSubmissionSignupAlreadyCompleted: alreadyCompleted,
  isFormSubmissionSignupLinkConsumed: linkConsumed,
}));
vi.mock('@/app/(onboarding)/apply/db', () => ({
  getOnboardingAccount: getAccount,
  getOnboardingTeam: getTeam,
}));
vi.mock('@/app/(unauthenticated)/signup/actions', () => ({ signUp: vi.fn() }));
vi.mock('@/app/(onboarding)/apply/navigation/actions', () => ({
  completeTeamStep: vi.fn(),
  completePaymentStep: vi.fn(),
  goBackToTeam: vi.fn(),
}));
vi.mock('@/app/(onboarding)/apply/actions', () => ({
  createAchSetupIntent: vi.fn(),
  recordAchSetupComplete: vi.fn(),
  inviteUserToFarm: vi.fn(),
  submitApplication: vi.fn(),
}));
vi.mock('@/app/(onboarding)/apply/components/colleagues/actions', () => ({
  resendVerificationEmail: vi.fn(),
  uninviteUser: vi.fn(),
}));
vi.mock(
  '@/app/(unauthenticated)/signup/components/approved-applicant-gate',
  () => ({ default: ({ reason }: { reason: string }) => <p>{reason}</p> })
);
vi.mock('@/app/(onboarding)/apply/components/onboarding-flow', () => ({
  default: ({ applicant, data }: OnboardingFlowProps) => (
    <main>
      {applicant
        ? applicant.passwordSet
          ? 'Saved password recovery'
          : 'Password form'
        : data.initialStep}
    </main>
  ),
}));
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error('Redirect: ' + url);
  },
}));

const account = {
  currentUser: ONBOARDING_DATA.currentUser,
  subscription: null,
  isApplicant: true,
  state: {
    passwordSet: true,
    teamStepDone: false,
    bankReady: false,
    paymentContinued: false,
    termsAccepted: false,
  },
};

describe('Apply', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getUserEmail.mockResolvedValue('alex@example.com');
    getUser.mockResolvedValue({
      data: { user: { email: 'alex@example.com', user_metadata: {} } },
      error: null,
    });
    getAccount.mockResolvedValue(account);
    getTeam.mockResolvedValue({
      farmInfo: {},
      allUsers: [],
      invitedUserVerificationStatus: [],
    });
  });

  it('renders password setup for a valid applicant with no farm or session yet', async () => {
    getUserEmail.mockResolvedValue(null);
    resolveSignupContext.mockResolvedValue({
      applicationId: 42,
      token: 'valid-token',
      email: 'alex@example.com',
    });
    render(
      await Apply({
        searchParams: Promise.resolve({
          application_id: '42',
          token: 'valid-token',
        }),
      })
    );
    expect(screen.getByText('Password form')).toBeInTheDocument();
    expect(getAccount).not.toHaveBeenCalled();
  });

  it('keeps saved-password recovery free of password fields for an active token', async () => {
    resolveSignupContext.mockResolvedValue({
      applicationId: 42,
      token: 'valid-token',
      email: 'alex@example.com',
    });
    getUser.mockResolvedValue({
      data: {
        user: {
          email: 'alex@example.com',
          user_metadata: {
            onboarding_applicant: true,
            onboarding_password_set: true,
            onboarding_application_id: 42,
          },
        },
      },
      error: null,
    });
    render(
      await Apply({
        searchParams: Promise.resolve({
          application_id: '42',
          token: 'valid-token',
        }),
      })
    );
    expect(screen.getByText('Saved password recovery')).toBeInTheDocument();
  });

  it('rejects a valid link opened with a different signed-in email', async () => {
    resolveSignupContext.mockResolvedValue({
      applicationId: 42,
      token: 'valid-token',
      email: 'other@example.com',
    });
    render(
      await Apply({
        searchParams: Promise.resolve({
          application_id: '42',
          token: 'valid-token',
        }),
      })
    );
    expect(screen.getByText('email-mismatch')).toBeInTheDocument();
    expect(getAccount).not.toHaveBeenCalled();
  });

  it.each(['42oops', '-1', '0', '9007199254740993'])(
    'rejects malformed application id %s',
    async (applicationId) => {
      render(
        await Apply({
          searchParams: Promise.resolve({
            application_id: applicationId,
            token: 'token',
          }),
        })
      );
      expect(screen.getByText('invalid-link')).toBeInTheDocument();
      expect(resolveSignupContext).not.toHaveBeenCalled();
    }
  );

  it('validates ownership of consumed links instead of switching to another account', async () => {
    resolveSignupContext.mockResolvedValue(null);
    alreadyCompleted.mockResolvedValue(false);
    render(
      await Apply({
        searchParams: Promise.resolve({
          application_id: '42',
          token: 'consumed-token',
        }),
      })
    );
    expect(screen.getByText('invalid-link')).toBeInTheDocument();
    expect(getAccount).not.toHaveBeenCalled();
  });

  it('resumes from a consumed link for its signed-in applicant', async () => {
    alreadyCompleted.mockResolvedValue(true);
    render(
      await Apply({
        searchParams: Promise.resolve({
          application_id: '42',
          token: 'consumed-token',
        }),
      })
    );
    expect(screen.getByText('team')).toBeInTheDocument();
  });

  it('sends signed-out owners of consumed links to login', async () => {
    getUserEmail.mockResolvedValue(null);
    linkConsumed.mockResolvedValue(true);
    await expect(
      Apply({
        searchParams: Promise.resolve({
          application_id: '42',
          token: 'consumed-token',
        }),
      })
    ).rejects.toThrow('Redirect: /login');
  });

  it('keeps payment selected when the bank is saved but Continue is not', async () => {
    getAccount.mockResolvedValue({
      ...account,
      state: { ...account.state, teamStepDone: true, bankReady: true },
    });
    render(await Apply({}));
    expect(screen.getByText('payment')).toBeInTheDocument();
  });

  it('renders terms only after persisted payment Continue', async () => {
    getAccount.mockResolvedValue({
      ...account,
      state: {
        ...account.state,
        teamStepDone: true,
        bankReady: true,
        paymentContinued: true,
      },
    });
    render(await Apply({}));
    expect(screen.getByText('terms')).toBeInTheDocument();
  });

  it('keeps invited viewers in their existing agreement path', async () => {
    getAccount.mockResolvedValue({
      ...account,
      isApplicant: false,
      currentUser: { ...account.currentUser, role: 'Viewer' },
    });
    await expect(Apply({})).rejects.toThrow('Redirect: /account/agreement');
    expect(getTeam).not.toHaveBeenCalled();
  });

  it('redirects completed applicants into the platform', async () => {
    getAccount.mockResolvedValue({
      ...account,
      state: { ...account.state, termsAccepted: true },
    });
    await expect(Apply({})).rejects.toThrow('Redirect: /');
    expect(getTeam).not.toHaveBeenCalled();
  });
});
