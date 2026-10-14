// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { createContext } from 'react';
import type { OnboardingContextValue } from '@/app/(onboarding)/apply/types';

/** Context supplied by the onboarding flow to its current step. */
export const ApplicationContext = createContext<OnboardingContextValue>(
  {} as OnboardingContextValue
);
