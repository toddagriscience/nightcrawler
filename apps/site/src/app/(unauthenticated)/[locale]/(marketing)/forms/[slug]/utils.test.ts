// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, expect, it } from 'vitest';
import type { SanityFormField } from '@/lib/sanity/form-types';
import {
  buildFormAnswersSchema,
  buildFormDefaultValues,
  buildStoredFormAnswers,
  expandFormFields,
} from './utils';

/** Certifications checkbox group used in iris-access mapping. */
const certificationsGroup: SanityFormField = {
  name: 'certifications',
  label: 'Select certifications',
  type: 'checkboxGroup',
  checkboxOptions: [
    { key: 'hasGAP', label: 'Good Agriculture Practices (GAP)' },
    { key: 'hasOrganic', label: 'Organic' },
    { key: 'hasNone', label: 'None of the above' },
  ],
};

describe('expandFormFields', () => {
  it('expands checkboxGroup options into virtual checkbox fields', () => {
    const expanded = expandFormFields([certificationsGroup]);

    expect(expanded).toHaveLength(3);
    expect(expanded.map((field) => field.name)).toEqual([
      'hasGAP',
      'hasOrganic',
      'hasNone',
    ]);
    expect(expanded.every((field) => field.type === 'checkbox')).toBe(true);
  });
});

describe('buildFormDefaultValues', () => {
  it('defaults each checkboxGroup option key to false', () => {
    const defaults = buildFormDefaultValues([certificationsGroup]);

    expect(defaults).toEqual({
      _hp: '',
      hasGAP: false,
      hasOrganic: false,
      hasNone: false,
    });
  });
});

describe('buildFormAnswersSchema', () => {
  it('accepts optional checkboxGroup answers with flat boolean keys', () => {
    const schema = buildFormAnswersSchema([certificationsGroup]);
    const result = schema.safeParse({
      hasGAP: true,
      hasOrganic: false,
      hasNone: false,
    });

    expect(result.success).toBe(true);
  });

  it('rejects required checkboxGroup when every option is false', () => {
    const requiredGroup: SanityFormField = {
      ...certificationsGroup,
      required: true,
    };
    const schema = buildFormAnswersSchema([requiredGroup]);
    const result = schema.safeParse({
      hasGAP: false,
      hasOrganic: false,
      hasNone: false,
    });

    expect(result.success).toBe(false);
  });

  it('accepts required checkboxGroup when at least one option is true', () => {
    const requiredGroup: SanityFormField = {
      ...certificationsGroup,
      required: true,
    };
    const schema = buildFormAnswersSchema([requiredGroup]);
    const result = schema.safeParse({
      hasGAP: false,
      hasOrganic: true,
      hasNone: false,
    });

    expect(result.success).toBe(true);
  });
});

describe('buildStoredFormAnswers', () => {
  it('persists flat checkboxGroup keys without the group name', () => {
    const stored = buildStoredFormAnswers(
      {
        hasGAP: true,
        hasOrganic: false,
        hasNone: false,
        _hp: '',
      },
      []
    );

    expect(stored).toEqual({
      hasGAP: true,
      hasOrganic: false,
      hasNone: false,
    });
    expect(stored).not.toHaveProperty('certifications');
  });
});
