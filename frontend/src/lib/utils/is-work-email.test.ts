// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, it, expect } from 'vitest';

import isWorkEmail from './is-work-email';

describe('isWorkEmail', () => {
  it('returns false for common personal email domains', () => {
    expect(isWorkEmail('user@gmail.com')).toBe(false);
    expect(isWorkEmail('user@yahoo.com')).toBe(false);
    expect(isWorkEmail('user@outlook.com')).toBe(false);
    expect(isWorkEmail('user@icloud.com')).toBe(false);
  });

  it('returns true for non-personal (work) domains', () => {
    expect(isWorkEmail('user@company.com')).toBe(true);
    expect(isWorkEmail('user@startup.io')).toBe(true);
    expect(isWorkEmail('user@enterprise.co')).toBe(true);
  });

  it('is case-insensitive for domains', () => {
    expect(isWorkEmail('user@GMAIL.COM')).toBe(false);
    expect(isWorkEmail('user@Company.COM')).toBe(true);
  });

  it('returns false for invalid email strings', () => {
    expect(isWorkEmail('not-an-email')).toBe(false);
    expect(isWorkEmail('missing-at-symbol.com')).toBe(false);
    expect(isWorkEmail('@gmail.com')).toBe(false);
  });

  it('handles subdomains as work emails', () => {
    expect(isWorkEmail('user@mail.company.com')).toBe(true);
  });
});
