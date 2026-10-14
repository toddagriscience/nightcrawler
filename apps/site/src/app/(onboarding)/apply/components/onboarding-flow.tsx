// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { OnboardingFlowProps } from '@/app/(onboarding)/apply/types';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import OnboardingProgress from '@/app/(onboarding)/apply/components/onboarding-progress';
import { ONBOARDING_STEPS } from '@/app/(onboarding)/apply/onboarding-steps';
import { LegalSubtext } from '@/components/common/legal-subtext/legal-subtext';
import SetPasswordStep from '@/app/(onboarding)/apply/components/set-password-step';
import Colleagues from '@/app/(onboarding)/apply/components/colleagues';
import BankInformation from '@/app/(onboarding)/apply/components/bank-information';
import TermsAndConditions from '@/app/(onboarding)/apply/components/terms-and-conditions';

/** Renders one server-selected step and refreshes the same URL after each transition. */
export default function OnboardingFlow({
  applicant,
  data,
  actions,
}: OnboardingFlowProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLElement>(null);
  const step = applicant ? 'password' : data.initialStep;
  const stepLabel =
    ONBOARDING_STEPS.find(({ id }) => id === step)?.label ?? step;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      contentRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [step]);

  return (
    <main className="mx-auto mb-16 mt-12 w-[90vw] max-w-[550px]">
      {step === 'password' ? (
        <h1 className="mb-10 text-center text-3xl font-normal md:text-4xl">
          Welcome to Todd-Iris
        </h1>
      ) : (
        <>
          <h1 className="sr-only">{stepLabel}</h1>
          <OnboardingProgress step={step} />
        </>
      )}
      <section
        ref={contentRef}
        tabIndex={-1}
        aria-label={`${step === 'team' ? 'Add people' : step.charAt(0).toUpperCase() + step.slice(1)} step`}
        className="mt-10 outline-none"
      >
        {applicant ? (
          <SetPasswordStep
            applicant={applicant}
            action={actions.signUp}
            onComplete={() => router.refresh()}
          />
        ) : (
          <ApplicationContext.Provider
            value={{
              ...data,
              canEditFarm: data.currentUser.role === 'Admin',
              actions,
              completeTeamStep: async () => {
                await actions.completeTeamStep();
                router.refresh();
              },
              completePaymentStep: async () => {
                await actions.completePaymentStep();
                router.refresh();
              },
              goBackToTeam: async () => {
                await actions.goBackToTeam();
                router.refresh();
              },
              onBankSetupComplete: () => router.refresh(),
            }}
          >
            {step === 'team' && <Colleagues />}
            {step === 'payment' && <BankInformation />}
            {step === 'terms' && <TermsAndConditions />}
          </ApplicationContext.Provider>
        )}
      </section>
      {step === 'password' && (
        <div className="mt-12 flex justify-center">
          <LegalSubtext />
        </div>
      )}
    </main>
  );
}
