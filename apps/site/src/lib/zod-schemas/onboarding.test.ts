// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';

import { userInfo } from './onboarding';

const phoneSchema = userInfo.shape.phone;

describe('userInfo phone', () => {
  it('normalizes a 10-digit US number to E.164', () => {
    expect(phoneSchema.parse('5554443333')).toBe('+15554443333');
  });

  it('strips dashes before normalizing', () => {
    expect(phoneSchema.parse('555-444-3333')).toBe('+15554443333');
  });

  it('keeps an already-E.164 number', () => {
    expect(phoneSchema.parse('+15554443333')).toBe('+15554443333');
  });

  it('normalizes an 11-digit number that starts with 1', () => {
    expect(phoneSchema.parse('15554443333')).toBe('+15554443333');
  });

  it('rejects values that are not E.164 after normalization', () => {
    const result = phoneSchema.safeParse('123');
    expect(result.success).toBe(false);
  });
});
