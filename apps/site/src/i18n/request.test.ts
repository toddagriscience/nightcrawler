// Copyright © Todd Agriscience, Inc. All rights reserved.

import logger from '@/lib/logger';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { messageFiles } from './message-files';
import { loadMessages } from './request';

describe('loadMessages', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and merges the message files for a known locale', async () => {
    const messages = await loadMessages('en');

    expect(Object.keys(messages).length).toBeGreaterThan(0);
  });

  it('reports unloadable message files through the logger, not console', async () => {
    const loggerWarn = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const messages = await loadMessages('not-a-locale');

    expect(messages).toEqual({});
    expect(loggerWarn).toHaveBeenCalledTimes(messageFiles.length);
    expect(loggerWarn.mock.calls[0][0]).toContain(
      'Could not load message file'
    );
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});
