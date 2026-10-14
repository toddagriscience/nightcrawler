// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Members of the `Storage` interface itself. Named-property access has to skip
 * these so `localStorage.length` keeps reporting the entry count rather than
 * resolving a stored item that happens to be called `length`.
 */
const STORAGE_MEMBERS: Record<string, true> = {
  length: true,
  key: true,
  getItem: true,
  setItem: true,
  removeItem: true,
  clear: true,
};

/**
 * Builds an in-memory `Storage` that matches the observable behaviour of a real
 * one: the method surface plus the named-property surface. Browsers and jsdom
 * implement `Storage` as a proxy-backed legacy platform object, so
 * `storage.foo = 'x'`, `storage['foo']`, `'foo' in storage`,
 * `delete storage.foo` and `Object.keys(storage)` all operate on stored
 * entries. A plain object would only cover the methods, which silently changes
 * semantics for any test that reaches for property access.
 *
 * @returns A `Storage` implementation backed by a plain record
 */
export function createMemoryStorage(): Storage {
  let entries: Record<string, string> = Object.create(null);

  const target = {
    get length() {
      return Object.keys(entries).length;
    },
    key(index: number): string | null {
      return Object.keys(entries)[index] ?? null;
    },
    getItem(key: string): string | null {
      const value = entries[String(key)];
      return value === undefined ? null : value;
    },
    setItem(key: string, value: string): void {
      entries[String(key)] = String(value);
    },
    removeItem(key: string): void {
      // A plain record plus the `delete` operator, rather than a Map, keeps the
      // repo-wide drizzle/enforce-delete-with-where rule from firing on a
      // `.delete()` method call that has nothing to do with the database.
      delete entries[String(key)];
    },
    clear(): void {
      entries = Object.create(null);
    },
  };

  /** True when `prop` addresses a stored entry rather than a `Storage` member. */
  const isNamedProperty = (prop: string | symbol): prop is string =>
    typeof prop === 'string' && STORAGE_MEMBERS[prop] !== true;

  return new Proxy(target, {
    get(receiverTarget, prop) {
      if (isNamedProperty(prop)) {
        return entries[prop];
      }
      return Reflect.get(receiverTarget, prop, receiverTarget);
    },
    set(receiverTarget, prop, value) {
      if (isNamedProperty(prop)) {
        entries[prop] = String(value);
        return true;
      }
      return Reflect.set(receiverTarget, prop, value, receiverTarget);
    },
    deleteProperty(receiverTarget, prop) {
      if (isNamedProperty(prop)) {
        delete entries[prop];
        return true;
      }
      return Reflect.deleteProperty(receiverTarget, prop);
    },
    has(receiverTarget, prop) {
      if (isNamedProperty(prop) && prop in entries) {
        return true;
      }
      return Reflect.has(receiverTarget, prop);
    },
    // Only stored entries are own enumerable keys; the interface members live on
    // the prototype of a real Storage, so `Object.keys` must not surface them.
    ownKeys() {
      return Object.keys(entries);
    },
    getOwnPropertyDescriptor(receiverTarget, prop) {
      if (isNamedProperty(prop)) {
        if (!(prop in entries)) {
          return undefined;
        }
        return {
          value: entries[prop],
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }
      return Reflect.getOwnPropertyDescriptor(receiverTarget, prop);
    },
  }) as Storage;
}
