// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithAct } from '@/test/test-utils';
import NewsHighlights from './news-highlights';
import '@testing-library/jest-dom';
import { vi, describe, it, expect } from 'vitest';

// Mock embla-carousel-react
vi.mock('embla-carousel-react', () => {
  const mockEmblaApi = {
    scrollSnapList: vi.fn(() => [0, 1, 2]),
    selectedScrollSnap: vi.fn(() => 0),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    scrollTo: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    canScrollPrev: vi.fn(() => true),
    canScrollNext: vi.fn(() => true),
  };

  return {
    __esModule: true,
    default: vi.fn(() => [
      vi.fn(), // emblaRef
      mockEmblaApi, // emblaApi
    ]),
  };
});

describe('NewsHighlights', () => {
  it('is temporary', () => {
    expect(true).toBeTruthy();
  });
});
