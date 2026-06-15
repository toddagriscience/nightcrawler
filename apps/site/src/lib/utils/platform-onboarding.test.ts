// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { isPreOnboardingPath } from './platform-onboarding';

describe('isPreOnboardingPath', () => {
  it('allows apply and accept routes during onboarding', () => {
    expect(isPreOnboardingPath('/apply')).toBe(true);
    expect(isPreOnboardingPath('/accept')).toBe(true);
    expect(isPreOnboardingPath('/accept/invite')).toBe(true);
  });

  it('blocks platform routes until onboarding completes', () => {
    expect(isPreOnboardingPath('/')).toBe(false);
    expect(isPreOnboardingPath('/search')).toBe(false);
    expect(isPreOnboardingPath('/account')).toBe(false);
    expect(isPreOnboardingPath('/order')).toBe(false);
  });
});
