// Copyright Todd Agriscience, Inc. All rights reserved.

import { renderWithAct, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import Carousel from './carousel';

// Mock embla-carousel-react
jest.mock('embla-carousel-react', () => {
  const mockEmblaApi = {
    scrollSnapList: jest.fn(() => [0, 1, 2]),
    selectedScrollSnap: jest.fn(() => 0),
    scrollPrev: jest.fn(),
    scrollNext: jest.fn(),
    scrollTo: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    canScrollPrev: jest.fn(() => true),
    canScrollNext: jest.fn(() => true),
  };

  return {
    __esModule: true,
    default: jest.fn(() => [
      jest.fn(), // emblaRef
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
