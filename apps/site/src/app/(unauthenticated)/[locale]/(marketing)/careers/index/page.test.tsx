// Copyright © Todd Agriscience, Inc. All rights reserved.

import '@testing-library/jest-dom';
import { permanentRedirect } from 'next/navigation';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import CareersIndexRedirect from './page';

vi.mock('next/navigation', () => ({
  permanentRedirect: vi.fn(),
}));

describe('/careers/index redirect', () => {
  beforeEach(() => {
    vi.mocked(permanentRedirect).mockClear();
  });

  it('permanent-redirects to /{locale}/careers', async () => {
    await CareersIndexRedirect({
      params: Promise.resolve({ locale: 'en' }),
    });

    expect(permanentRedirect).toHaveBeenCalledWith('/en/careers');
  });
});
