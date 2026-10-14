// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ONBOARDING_STEPS } from '@/app/(onboarding)/apply/onboarding-steps';
import type { OnboardingStep } from '@/app/(onboarding)/apply/types';

/** Four non-interactive progress lines with the current step announced accessibly. */
export default function OnboardingProgress({ step }: { step: OnboardingStep }) {
  const currentIndex = ONBOARDING_STEPS.findIndex(({ id }) => id === step);

  return (
    <ol aria-label="Account setup progress" className="grid grid-cols-4 gap-3">
      {ONBOARDING_STEPS.map(({ id, label }, index) => (
        <li key={id} aria-current={id === step ? 'step' : undefined}>
          <span
            aria-hidden="true"
            className={`mb-3 block h-1 w-full ${index <= currentIndex ? 'bg-foreground' : 'bg-foreground/20'}`}
          />
          <span
            className={`text-xs ${id === step ? 'font-medium text-foreground' : 'text-foreground/70'}`}
          >
            {label}
            {index < currentIndex && (
              <span className="sr-only">, completed</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
