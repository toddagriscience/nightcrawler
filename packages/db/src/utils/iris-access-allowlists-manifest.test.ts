// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  isKeyAllowedForStorageTarget,
  isPrefixedFarmInfoJsonbAnswerKey,
} from './iris-access-allowlists-manifest';

describe('prefixed farm info JSONB answer keys', () => {
  it('accepts checkbox keys that prefix a JSONB column', () => {
    expect(isPrefixedFarmInfoJsonbAnswerKey('alternateFarming_no')).toBe(true);
    expect(
      isPrefixedFarmInfoJsonbAnswerKey('nearContaminationSource_yes_isYes')
    ).toBe(true);
  });

  it('rejects bare JSONB column names and unrelated keys', () => {
    expect(isPrefixedFarmInfoJsonbAnswerKey('alternateFarming')).toBe(false);
    expect(isPrefixedFarmInfoJsonbAnswerKey('conservationPlan')).toBe(false);
  });
});

describe('isKeyAllowedForStorageTarget', () => {
  it('allows prefixed JSONB keys for farm_info_internal_application', () => {
    expect(
      isKeyAllowedForStorageTarget(
        'farm_info_internal_application',
        'alternateFarming_yesCurrently'
      )
    ).toBe(true);
    expect(
      isKeyAllowedForStorageTarget(
        'farm_info_internal_application',
        'nearContaminationSource_no'
      )
    ).toBe(true);
  });

  it('still allows scalar keys on farm_info_internal_application', () => {
    expect(
      isKeyAllowedForStorageTarget(
        'farm_info_internal_application',
        'conservationPlan'
      )
    ).toBe(true);
  });
});
