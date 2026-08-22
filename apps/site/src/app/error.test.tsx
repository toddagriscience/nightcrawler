// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Error from './error';

vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), warn: vi.fn(), log: vi.fn(), info: vi.fn() },
}));

const CHUNK_RELOAD_KEY = 'chunk-reload-attempted';

const originalLocation = window.location;
const originalSessionStorage = window.sessionStorage;
const reload = vi.fn();

/**
 * Builds a ChunkLoadError like the one webpack throws for a stale chunk
 * @param {string} name - Error name to use
 * @param {string} message - Error message to use
 * @returns {Error} The constructed error
 */
const makeError = (name: string, message: string): Error => {
  const error = new globalThis.Error(message);
  error.name = name;
  return error;
};

describe('App error boundary', () => {
  beforeEach(() => {
    reload.mockClear();
    // jsdom's Location cannot be spied on, so swap in a stub for the test and
    // restore the real object afterwards.
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...originalLocation, href: originalLocation.href, reload },
    });
    window.sessionStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      writable: true,
      value: originalSessionStorage,
    });
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('reloads exactly once for a ChunkLoadError and records the attempt', () => {
    render(
      <Error
        error={makeError('ChunkLoadError', 'Loading chunk 42 failed')}
        reset={vi.fn()}
      />
    );

    expect(reload).toHaveBeenCalledTimes(1);
    expect(
      Number(window.sessionStorage.getItem(CHUNK_RELOAD_KEY))
    ).toBeGreaterThan(0);
    expect(screen.getByRole('status')).toHaveTextContent(/Reloading/);
  });

  it('detects a stale chunk from the message alone', () => {
    render(
      <Error
        error={makeError('Error', 'Loading chunk app/page failed')}
        reset={vi.fn()}
      />
    );

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload again while a recent attempt is recorded', () => {
    window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));

    render(
      <Error
        error={makeError('ChunkLoadError', 'Loading chunk 42 failed')}
        reset={vi.fn()}
      />
    );

    expect(reload).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });

  it('recovers again once an earlier attempt has expired', () => {
    window.sessionStorage.setItem(
      CHUNK_RELOAD_KEY,
      String(Date.now() - 5 * 60_000)
    );

    render(
      <Error
        error={makeError('ChunkLoadError', 'Loading chunk 42 failed')}
        reset={vi.fn()}
      />
    );

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload for a non-chunk error', () => {
    const reset = vi.fn();
    render(
      <Error error={makeError('Error', 'Invalid credentials')} reset={reset} />
    );

    expect(reload).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem(CHUNK_RELOAD_KEY)).toBeNull();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    screen.getByRole('button', { name: 'Try again' }).click();
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('shows the error UI instead of reloading when sessionStorage is unusable', () => {
    // jsdom's Storage is a proxy that cannot be spied on, so swap the whole
    // object for one that denies access the way Safari's private mode does.
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      writable: true,
      value: {
        getItem: () => {
          throw new DOMException('denied', 'SecurityError');
        },
        setItem: () => {
          throw new DOMException('denied', 'SecurityError');
        },
        removeItem: () => {},
        clear: () => {},
      },
    });

    render(
      <Error
        error={makeError('ChunkLoadError', 'Loading chunk 42 failed')}
        reset={vi.fn()}
      />
    );

    expect(reload).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });
});
