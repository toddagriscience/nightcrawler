// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useContext } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OnboardingFlow from '@/app/(onboarding)/apply/components/onboarding-flow';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import {
  ONBOARDING_ACTIONS,
  ONBOARDING_DATA,
} from '@/app/(onboarding)/apply/components/onboarding-fixtures';

const { refresh, push } = vi.hoisted(() => ({
  refresh: vi.fn(),
  push: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh, push }) }));
vi.mock('@/app/(onboarding)/apply/components/colleagues', () => ({
  default: function Team() {
    const context = useContext(ApplicationContext);
    return (
      <button onClick={() => void context.completeTeamStep()}>
        Continue from team
      </button>
    );
  },
}));
vi.mock('@/app/(onboarding)/apply/components/bank-information', () => ({
  default: function Payment() {
    const context = useContext(ApplicationContext);
    return (
      <>
        <p>Payment form</p>
        <button onClick={() => void context.goBackToTeam()}>
          Back to team
        </button>
      </>
    );
  },
}));
vi.mock('@/app/(onboarding)/apply/components/terms-and-conditions', () => ({
  default: () => <p>Terms content</p>,
}));

describe('OnboardingFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  it('renders only the server-selected step without tabs', () => {
    render(
      <OnboardingFlow data={ONBOARDING_DATA} actions={ONBOARDING_ACTIONS} />
    );
    expect(
      screen.getByRole('button', { name: 'Continue from team' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Payment form')).not.toBeInTheDocument();
    expect(screen.queryByText('Terms content')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Create a Password')
    ).not.toBeInTheDocument();
  });

  it('waits for persisted completion, refreshes, and follows the new server state without routing', async () => {
    const completeTeamStep = vi.fn().mockResolvedValue({});
    const { rerender } = render(
      <OnboardingFlow
        data={ONBOARDING_DATA}
        actions={{ ...ONBOARDING_ACTIONS, completeTeamStep }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue from team' }));
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(completeTeamStep).toHaveBeenCalledOnce();
    expect(push).not.toHaveBeenCalled();
    rerender(
      <OnboardingFlow
        data={{ ...ONBOARDING_DATA, initialStep: 'payment' }}
        actions={ONBOARDING_ACTIONS}
      />
    );
    expect(screen.getByText('Payment form')).toBeInTheDocument();
    expect(screen.queryByText('Continue from team')).not.toBeInTheDocument();
  });

  it('persists Back rather than merely changing local state', async () => {
    const goBackToTeam = vi.fn().mockResolvedValue({});
    render(
      <OnboardingFlow
        data={{ ...ONBOARDING_DATA, initialStep: 'payment' }}
        actions={{ ...ONBOARDING_ACTIONS, goBackToTeam }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Back to team' }));
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(goBackToTeam).toHaveBeenCalledOnce();
    expect(push).not.toHaveBeenCalled();
  });

  it('keeps the completed password and payment forms unmounted on terms', () => {
    render(
      <OnboardingFlow
        data={{
          ...ONBOARDING_DATA,
          initialStep: 'terms',
          paymentContinued: true,
          hasBankSetup: true,
        }}
        actions={ONBOARDING_ACTIONS}
      />
    );
    expect(screen.getByText('Terms content')).toBeInTheDocument();
    expect(screen.queryByText('Payment form')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /back/i })
    ).not.toBeInTheDocument();
  });
});
