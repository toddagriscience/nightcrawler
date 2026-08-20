// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import 'whatwg-fetch';

/**
 * Restores a working Web Storage implementation when the host Node build
 * shadows jsdom's.
 *
 * Node 22 shipped a built-in `localStorage`/`sessionStorage`. From Node 24 it
 * is exposed by default, but it only functions when the process is started
 * with a valid `--localstorage-file` path; otherwise Node installs a global
 * with no methods on it and warns. That global takes precedence over the one
 * jsdom installs, so `localStorage.clear()` throws "is not a function" inside
 * tests. Because those calls usually live in `beforeEach`/`afterEach`, the
 * throw aborts the hook chain before Testing Library's `cleanup` runs, leaving
 * mounted DOM behind and turning a single failure into cascading "Found
 * multiple elements" errors in unrelated tests.
 *
 * The repo targets Node 20 (see `.nvmrc`), where this does not apply and the
 * guard below is inert. It only engages on newer local toolchains so the suite
 * behaves the same there as it does in CI.
 */
function createMemoryStorage(): Storage {
  let entries: Record<string, string> = Object.create(null);

  return {
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
  } as Storage;
}

for (const name of ['localStorage', 'sessionStorage'] as const) {
  const existing = globalThis[name] as Storage | undefined;

  // A healthy Storage exposes the full interface; Node's stub exposes none of it.
  if (typeof existing?.clear === 'function') {
    continue;
  }

  const storage = createMemoryStorage();
  const descriptor = {
    value: storage,
    writable: true,
    configurable: true,
  };

  Object.defineProperty(globalThis, name, descriptor);

  if (typeof window !== 'undefined' && window !== (globalThis as unknown)) {
    Object.defineProperty(window, name, descriptor);
  }
}
