// Copyright © Todd Agriscience, Inc. All rights reserved.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const newrelicAgent = vi.hoisted(() => ({
  importCount: 0,
}));

vi.mock('./newrelic-agent.cjs', () => {
  newrelicAgent.importCount += 1;
  return {};
});

describe('instrumentation register', () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    newrelicAgent.importCount = 0;
    process.env = { ...envBackup };
  });

  afterEach(() => {
    process.env = envBackup;
  });

  it('loads the New Relic agent when NEW_RELIC_ENABLED is true and license key is set', async () => {
    process.env.NEXT_RUNTIME = 'nodejs';
    process.env.NEW_RELIC_ENABLED = 'true';
    process.env.NEW_RELIC_LICENSE_KEY = 'test-license-key';

    const { register } = await import('./register');
    await register();

    expect(newrelicAgent.importCount).toBe(1);
  });

  it('does not load the New Relic agent when NEW_RELIC_ENABLED is false', async () => {
    process.env.NEXT_RUNTIME = 'nodejs';
    process.env.NEW_RELIC_ENABLED = 'false';
    process.env.NEW_RELIC_LICENSE_KEY = 'test-license-key';

    const { register } = await import('./register');
    await register();

    expect(newrelicAgent.importCount).toBe(0);
  });
});
