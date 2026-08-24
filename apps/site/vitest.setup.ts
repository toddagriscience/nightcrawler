// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { createMemoryStorage } from '@/test/memory-storage';

/**
 * Restores a working Web Storage implementation when the host Node build
 * shadows jsdom's.
 *
 * Node 22 shipped a built-in `localStorage`/`sessionStorage` behind
 * `--experimental-webstorage`, and Node 25 exposes it by default. It only
 * functions when the process is started with a valid `--localstorage-file`
 * path; otherwise Node installs a global with no methods on it and warns. That
 * global takes precedence over the one jsdom installs, so `localStorage.clear()`
 * throws "is not a function" inside tests. Because those calls usually live in
 * `beforeEach`/`afterEach`, the throw aborts the hook chain before Testing
 * Library's `cleanup` runs, leaving mounted DOM behind and turning a single
 * failure into cascading "Found multiple elements" errors in unrelated tests.
 *
 * The repo targets Node 20 (see `.nvmrc`), where this does not apply and the
 * guard below is inert. It only engages on newer local toolchains so the suite
 * behaves the same there as it does in CI.
 */
// Web Storage is a DOM API. `@vitest-environment node` files (for example
// src/app/robots.test.ts) must keep server semantics, where it is absent. The
// check is loop-invariant, so it gates the loop rather than sitting inside it.
if (typeof window !== 'undefined') {
  for (const name of ['localStorage', 'sessionStorage'] as const) {
    // Reading the global is not side-effect free: Node 25.2.x, and Node 22-24
    // under `--experimental-webstorage`, throw from this getter when
    // `--localstorage-file` is missing. Treat a throw as an unusable Storage.
    let existing: Storage | undefined;
    try {
      existing = globalThis[name] as Storage | undefined;
    } catch {
      existing = undefined;
    }

    // A healthy Storage exposes the full interface; Node's stub exposes none of it.
    if (typeof existing?.clear === 'function') {
      continue;
    }

    const descriptor = {
      value: createMemoryStorage(),
      writable: true,
      configurable: true,
    };

    Object.defineProperty(globalThis, name, descriptor);

    if (window !== (globalThis as unknown)) {
      Object.defineProperty(window, name, descriptor);
    }
  }
}
