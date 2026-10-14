// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import {
  buildGmailComposeUrl,
  buildOfferEmail,
  OFFER_EMAIL_SUBJECT,
} from './email-template';

describe('offer email helpers', () => {
  it('uses the candidate first name and position in the message', () => {
    const message = buildOfferEmail('Casey Example', 'Field Researcher');
    expect(message).toContain('Hi Casey,');
    expect(message).toContain('join Todd as a Field Researcher');
  });

  it('creates a Gmail compose URL with the approved subject and body', () => {
    const body = buildOfferEmail('Casey Example', 'Field Researcher');
    const url = new URL(buildGmailComposeUrl(OFFER_EMAIL_SUBJECT, body));
    expect(url.origin).toBe('https://mail.google.com');
    expect(url.searchParams.get('su')).toBe(OFFER_EMAIL_SUBJECT);
    expect(url.searchParams.get('body')).toBe(body);
  });
});
