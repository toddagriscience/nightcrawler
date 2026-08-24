// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it } from 'vitest';
import { createMemoryStorage } from './memory-storage';

describe('createMemoryStorage', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it('round-trips entries through the method surface', () => {
    storage.setItem('token', 'abc');

    expect(storage.getItem('token')).toBe('abc');
    expect(storage.length).toBe(1);
    expect(storage.key(0)).toBe('token');

    storage.removeItem('token');

    expect(storage.getItem('token')).toBeNull();
    expect(storage.length).toBe(0);
    expect(storage.key(0)).toBeNull();
  });

  it('clears every entry', () => {
    storage.setItem('a', '1');
    storage.setItem('b', '2');

    storage.clear();

    expect(storage.length).toBe(0);
    expect(storage.getItem('a')).toBeNull();
  });

  it('coerces non-string keys and values like a real Storage', () => {
    // The DOM signature is string-only, so exercising coercion needs a cast.
    const loose = storage as unknown as Record<string, unknown> & Storage;
    loose.setItem(1 as unknown as string, 2 as unknown as string);

    expect(storage.getItem('1')).toBe('2');
  });

  it('supports named-property writes and reads', () => {
    const loose = storage as unknown as Record<string, string | undefined>;
    loose.theme = 'dark';

    expect(storage.getItem('theme')).toBe('dark');
    expect(loose.theme).toBe('dark');
    expect(loose['theme']).toBe('dark');
    expect(storage.length).toBe(1);
  });

  it('exposes stored entries to `in`, `delete` and key enumeration', () => {
    storage.setItem('one', '1');
    storage.setItem('two', '2');
    const loose = storage as unknown as Record<string, string | undefined>;

    expect('one' in loose).toBe(true);
    expect('missing' in loose).toBe(false);
    expect(Object.keys(loose)).toEqual(['one', 'two']);
    expect(Object.entries(loose)).toEqual([
      ['one', '1'],
      ['two', '2'],
    ]);

    delete loose.one;

    expect('one' in loose).toBe(false);
    expect(storage.getItem('one')).toBeNull();
    expect(Object.keys(loose)).toEqual(['two']);
  });

  it('returns undefined for a missing named property', () => {
    const loose = storage as unknown as Record<string, string | undefined>;

    expect(loose.nope).toBeUndefined();
  });

  it('keeps interface members off the enumerable key list', () => {
    storage.setItem('only', '1');
    const loose = storage as unknown as Record<string, unknown>;

    expect(Object.keys(loose)).toEqual(['only']);
    expect(typeof loose.setItem).toBe('function');
    expect(loose.length).toBe(1);
  });

  it('reflects `clear` through named-property access', () => {
    storage.setItem('stale', '1');
    const loose = storage as unknown as Record<string, string | undefined>;

    storage.clear();

    expect(loose.stale).toBeUndefined();
    expect(Object.keys(loose)).toEqual([]);
  });
});

describe('ambient web storage', () => {
  // The regression the setup shim exists for: Node's own `localStorage` stub
  // has no methods, so this call used to throw and abort the hook chain.
  it('provides a usable localStorage and sessionStorage', () => {
    expect(() => localStorage.clear()).not.toThrow();
    expect(() => sessionStorage.clear()).not.toThrow();

    localStorage.setItem('probe', 'value');

    expect(localStorage.getItem('probe')).toBe('value');

    localStorage.clear();

    expect(localStorage.getItem('probe')).toBeNull();
  });
});
