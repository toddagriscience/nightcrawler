// Copyright Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithAct } from '@/test/test-utils';
import Carousel from './carousel';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

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

describe('Carousel', () => {
  const mockChildren = (
    <>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </>
  );

  it('renders without crashing', async () => {
    await renderWithAct(<Carousel>{mockChildren}</Carousel>);

    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('renders navigation buttons', async () => {
    await renderWithAct(<Carousel>{mockChildren}</Carousel>);

    expect(
      screen.getByRole('button', { name: 'Previous slide' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next slide' })
    ).toBeInTheDocument();
  });

  it('applies custom className', async () => {
    const { container } = await renderWithAct(
      <Carousel className="custom-class">{mockChildren}</Carousel>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
