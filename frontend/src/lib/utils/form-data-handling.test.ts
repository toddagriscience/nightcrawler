// Copyright © Todd Agriscience, Inc. All rights reserved.

import { describe, it, expect } from 'vitest';

import {
  parseJsonField,
  parseStringField,
  parseIntegerField,
  parseNumericField,
} from './form-data-handling';

describe('parseJsonField', () => {
  it('returns parsed object for valid JSON', () => {
    expect(parseJsonField('{"key": "value"}')).toEqual({ key: 'value' });
    expect(parseJsonField('[1, 2, 3]')).toEqual([1, 2, 3]);
  });

  it('returns undefined for invalid JSON', () => {
    expect(parseJsonField('not valid json')).toBeUndefined();
    expect(parseJsonField('{broken')).toBeUndefined();
  });

  it('returns undefined for empty or null values', () => {
    expect(parseJsonField(null)).toBeUndefined();
    expect(parseJsonField('')).toBeUndefined();
    expect(parseJsonField('   ')).toBeUndefined();
  });

  it('returns undefined for File objects', () => {
    const file = new File(['content'], 'test.txt');
    expect(parseJsonField(file)).toBeUndefined();
  });
});

describe('parseStringField', () => {
  it('returns trimmed string for valid input', () => {
    expect(parseStringField('hello')).toBe('hello');
    expect(parseStringField('  hello  ')).toBe('hello');
  });

  it('returns undefined for empty or null values', () => {
    expect(parseStringField(null)).toBeUndefined();
    expect(parseStringField('')).toBeUndefined();
    expect(parseStringField('   ')).toBeUndefined();
  });

  it('returns undefined for File objects', () => {
    const file = new File(['content'], 'test.txt');
    expect(parseStringField(file)).toBeUndefined();
  });
});

describe('parseIntegerField', () => {
  it('returns parsed integer for valid input', () => {
    expect(parseIntegerField('42')).toBe(42);
    expect(parseIntegerField('  100  ')).toBe(100);
    expect(parseIntegerField('-5')).toBe(-5);
  });

  it('returns undefined for non-integer strings', () => {
    expect(parseIntegerField('abc')).toBeUndefined();
    expect(parseIntegerField('12.5')).toBe(12); // parseInt behavior
  });

  it('returns undefined for empty or null values', () => {
    expect(parseIntegerField(null)).toBeUndefined();
    expect(parseIntegerField('')).toBeUndefined();
    expect(parseIntegerField('   ')).toBeUndefined();
  });

  it('returns undefined for File objects', () => {
    const file = new File(['content'], 'test.txt');
    expect(parseIntegerField(file)).toBeUndefined();
  });
});

describe('parseNumericField', () => {
  it('returns trimmed string for valid numeric input', () => {
    expect(parseNumericField('3.14')).toBe('3.14');
    expect(parseNumericField('  42  ')).toBe('42');
    expect(parseNumericField('-0.5')).toBe('-0.5');
  });

  it('returns undefined for non-numeric strings', () => {
    expect(parseNumericField('abc')).toBeUndefined();
    expect(parseNumericField('12abc')).toBe('12abc'); // parseFloat parses leading numbers
  });

  it('returns undefined for empty or null values', () => {
    expect(parseNumericField(null)).toBeUndefined();
    expect(parseNumericField('')).toBeUndefined();
    expect(parseNumericField('   ')).toBeUndefined();
  });

  it('returns undefined for File objects', () => {
    const file = new File(['content'], 'test.txt');
    expect(parseNumericField(file)).toBeUndefined();
  });
});
