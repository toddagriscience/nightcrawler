// Copyright © Todd Agriscience, Inc. All rights reserved.

/* eslint-disable no-secrets/no-secrets -- test fixtures use realistic signup tokens */

import { describe, expect, it } from 'vitest';
import { buildApprovedApplicantAuthConfirmUrl } from './approved-applicant-auth-url';

describe('buildApprovedApplicantAuthConfirmUrl', () => {
  it('builds flat application_id and signup_token query params for legacy redirects', () => {
    const url = buildApprovedApplicantAuthConfirmUrl(
      'http://localhost:3000',
      6,
      'c65a04e7-2eae-4330-b2e6-892f9510e49a'
    );

    expect(url).toBe(
      'http://localhost:3000/auth/confirm?application_id=6&signup_token=c65a04e7-2eae-4330-b2e6-892f9510e49a'
    );
  });
});
