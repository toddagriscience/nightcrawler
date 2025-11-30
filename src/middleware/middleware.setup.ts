// Copyright (c) Todd Agriscience, Inc. All rights reserved.

/**
 * Jest setup for middleware tests
 * Provides required Web API globals for Next.js middleware testing
 */

// Mock Web API globals that are required by Next.js server components
Object.defineProperty(global, 'Request', {
  value: class MockRequest {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_input: unknown, _init?: unknown) {
      // Basic mock implementation
    }
  },
  writable: true,
});

Object.defineProperty(global, 'Response', {
  value: class MockResponse {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_body?: unknown, _init?: unknown) {
      // Basic mock implementation
    }
  },
  writable: true,
});

Object.defineProperty(global, 'Headers', {
  value: class MockHeaders {
    private entries: [string, string][] = [];

    constructor(init?: unknown) {
      if (init) {
        if (Array.isArray(init)) {
          this.entries = [...init];
        } else if (typeof init === 'object') {
          this.entries = Object.entries(init);
        }
      }
    }

    forEach(callback: (value: string, key: string) => void) {
      this.entries.forEach(([key, value]) => callback(value, key));
    }

    get(name: string) {
      const entry = this.entries.find(
        ([key]) => key.toLowerCase() === name.toLowerCase()
      );
      return entry ? entry[1] : null;
    }

    set(name: string, value: string) {
      const existingIndex = this.entries.findIndex(
        ([key]) => key.toLowerCase() === name.toLowerCase()
      );
      if (existingIndex >= 0) {
        this.entries[existingIndex] = [name, value];
      } else {
        this.entries.push([name, value]);
      }
    }
  },
  writable: true,
});

// Export to ensure module loads
export {};
