// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import { buildFormSubmissionHydrationPreview } from './preview-form-submission-hydration';

describe('buildFormSubmissionHydrationPreview', () => {
  it('includes submit rows and signup hydration rows for iris-access', () => {
    const preview = buildFormSubmissionHydrationPreview({
      formSlug: 'iris-access',
      answers: {
        firstName: 'Ada',
        email: 'ada@farm.test',
        businessName: 'Ada Farms LLC',
        hasGAP: true,
        conservationPlan: 'NRCS contract',
        alternateFarming_no: true,
      },
    });

    expect(preview.hydratesFarm).toBe(true);
    expect(
      preview.rows.some(
        (row) =>
          row.when === 'on_submit' &&
          row.table === 'form_submissions' &&
          row.sourceKeys === 'firstName'
      )
    ).toBe(true);
    expect(
      preview.rows.some(
        (row) =>
          row.when === 'on_signup_prefill' &&
          row.table === 'user' &&
          row.column === 'first_name'
      )
    ).toBe(true);
    expect(
      preview.rows.some(
        (row) =>
          row.when === 'on_signup_hydration' &&
          row.table === 'farm' &&
          row.column === 'business_name'
      )
    ).toBe(true);
    expect(
      preview.rows.some(
        (row) =>
          row.when === 'on_signup_hydration' &&
          row.table === 'farm_certificate' &&
          row.column === 'has_gap'
      )
    ).toBe(true);
    expect(
      preview.rows.some(
        (row) =>
          row.when === 'on_signup_hydration' &&
          row.table === 'farm_info_internal_application' &&
          row.column === 'alternate_farming'
      )
    ).toBe(true);
  });

  it('marks unknown keys as not hydrated', () => {
    const preview = buildFormSubmissionHydrationPreview({
      formSlug: 'iris-access',
      answers: {
        mysteryField: 'stays in json',
      },
    });

    expect(
      preview.rows.some(
        (row) =>
          row.when === 'not_hydrated' && row.sourceKeys === 'mysteryField'
      )
    ).toBe(true);
  });
});
