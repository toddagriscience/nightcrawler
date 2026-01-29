// Copyright © Todd Agriscience, Inc. All rights reserved.

import { notFound } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';
import CatchAllPage from './page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('CatchAllPage', () => {
  it('should delegate to notFound()', () => {
    // Call the component
    CatchAllPage();

    // Assert that notFound was called
    expect(notFound).toHaveBeenCalled();
  });
});
