// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveApplication } from './actions';
import { user } from '@/lib/db/schema/user';

const mockGetClaims = vi.fn();

vi.mock('@/lib/supabase/server', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/supabase/server')>();
  return {
    ...actual,
    createClient: vi.fn(() => ({
      auth: {
        getClaims: mockGetClaims,
      },
    })),
  };
});

const { db } = await vi.hoisted(async () => {
  const { drizzle } = await import('drizzle-orm/pglite');
  const { seed } = await import('drizzle-seed');
  const { farm } = await import('@/lib/db/schema/index');
  const schema = await import('@/lib/db/schema');
  const { migrate } = await import('drizzle-orm/pglite/migrator');

  const db = drizzle({ schema });
  await migrate(db, { migrationsFolder: 'drizzle' });
  await seed(db, { farm });
  return { db };
});

vi.mock('@/lib/db/schema', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@/lib/db/schema')>()),
    db,
  };
});

describe('saveApplication', () => {
  beforeEach(() => {});
  it('saves with no information given', async () => {
    const [singleUser] = await db
      .select({ email: user.email })
      .from(user)
      .limit(1);

    if (!singleUser || !singleUser.email) {
      return;
    }

    const email = singleUser.email;

    mockGetClaims.mockReturnValue({
      data: { email },
      error: null,
    });

    const result = await saveApplication(new FormData());
    expect(result.error).toBeNull();
  });

  it('saves with some information given', async () => {
    const [singleUser] = await db
      .select({ email: user.email })
      .from(user)
      .limit(1);

    if (!singleUser || !singleUser.email) {
      return;
    }

    const email = singleUser.email;

    mockGetClaims.mockReturnValue({
      data: { email },
      error: null,
    });

    const data = new FormData();
    data.set('splitOperation', JSON.stringify({ foo: 'bar' }));
    data.set('livestockIncorporation', 'zoo');

    const result = await saveApplication(data);
    expect(result.error).toBeNull();
  });

  it('throws error with incorrect email', async () => {
    mockGetClaims.mockReturnValue({
      data: { email: '' },
      error: null,
    });

    const result = await saveApplication(new FormData());
    expect(result.error).not.toBeNull();
  });
});
