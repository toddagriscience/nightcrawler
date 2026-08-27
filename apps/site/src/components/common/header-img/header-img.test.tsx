// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import { describe, expect, test, vitest } from 'vitest';
import HeaderImg from './header-img';

vitest.mock('next/image', () => ({
  default: ({
    src,
    alt,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} {...props} />
  ),
}));

describe('HeaderImg', () => {
  test('renders an image with the provided alt text', () => {
    render(<HeaderImg src="/test-image.jpg" alt="Test image" />);

    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  test('applies custom wrapper and image classes', () => {
    render(
      <HeaderImg
        src="/test-image.jpg"
        alt="Test image"
        wrapperClassName="test-wrapper"
        imageClassName="test-image"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('test-image');

    const wrapper = image.parentElement?.parentElement;
    expect(wrapper).toHaveClass('test-wrapper');
  });

  test('renders no figure when no caption is supplied', () => {
    const { container } = render(
      <HeaderImg src="/test-image.jpg" alt="Test image" />
    );

    expect(container.querySelector('figure')).toBeNull();
  });

  test('ties a supplied caption to the image with figure and figcaption', () => {
    const { container } = render(
      <HeaderImg
        src="/test-image.jpg"
        alt="Test image"
        caption="Image: Somewhere, CA"
      />
    );

    const caption = screen.getByText('Image: Somewhere, CA');

    expect(caption.tagName).toBe('FIGCAPTION');

    // A screen reader announces the two together only when they share a figure.
    const figure = container.querySelector('figure');
    expect(figure).not.toBeNull();
    expect(figure).toContainElement(caption);
    expect(figure).toContainElement(screen.getByAltText('Test image'));
  });

  test('keeps the caption at 14px and left aligned', () => {
    render(
      <HeaderImg
        src="/test-image.jpg"
        alt="Test image"
        caption="Image: Somewhere, CA"
      />
    );

    const caption = screen.getByText('Image: Somewhere, CA');

    expect(caption).toHaveClass('text-sm');
    expect(caption).toHaveClass('text-left');
  });

  test('still applies wrapperClassName to the image box when captioned', () => {
    render(
      <HeaderImg
        src="/test-image.jpg"
        alt="Test image"
        caption="Image: Somewhere, CA"
        wrapperClassName="test-wrapper"
      />
    );

    const wrapper =
      screen.getByAltText('Test image').parentElement?.parentElement;

    expect(wrapper).toHaveClass('test-wrapper');
  });

  test.each([
    [
      'without a caption',
      undefined,
      ['h-[495px]', 'md:h-[595px]', 'lg:h-[630px]'],
    ],
    ['with a caption', 'Image: Somewhere, CA', ['h-[var(--frame-h)]']],
  ])('preserves the parallax structure %s', (_name, caption, heightClasses) => {
    render(
      <HeaderImg src="/test-image.jpg" alt="Test image" caption={caption} />
    );

    const parallaxLayer = screen.getByAltText('Test image').parentElement;
    const clipBox = parallaxLayer?.parentElement;

    // `useScroll` measures the clipping box, so the layer and the clip have to
    // stay on the image rather than move out to the figure with the framing.
    expect(parallaxLayer).toHaveClass('absolute', 'inset-0');
    expect(clipBox).toHaveClass(
      'relative',
      'overflow-hidden',
      ...heightClasses
    );
  });

  test('leaves the caption outside the box that clips the parallax', () => {
    render(
      <HeaderImg
        src="/test-image.jpg"
        alt="Test image"
        caption="Image: Somewhere, CA"
      />
    );

    const caption = screen.getByText('Image: Somewhere, CA');
    const clipBox =
      screen.getByAltText('Test image').parentElement?.parentElement;

    // Inside the box it would be clipped away and dragged by the transform.
    expect(clipBox).not.toContainElement(caption);
    expect(caption.parentElement?.tagName).toBe('FIGURE');
  });

  test('drives the caption offset from the same value as the photo', () => {
    const { container } = render(
      <HeaderImg
        src="/test-image.jpg"
        alt="Test image"
        caption="Image: Somewhere, CA"
      />
    );

    // Frame and caption share one height, so neither has to measure anything.
    expect(container.querySelector('figure')).toHaveClass(
      '[--frame-h:495px]',
      'md:[--frame-h:595px]',
      'lg:[--frame-h:630px]'
    );
    expect(screen.getByText('Image: Somewhere, CA')).toHaveClass(
      'translate-y-[calc(min(0,var(--caption-shift,-20))*var(--frame-h)/100)]'
    );

    const clipBox =
      screen.getByAltText('Test image').parentElement?.parentElement;
    expect(clipBox).toHaveClass('h-[var(--frame-h)]');
  });

  test('leaves the layer flush with the frame so the photo is never upscaled', () => {
    render(
      <HeaderImg
        src="/test-image.jpg"
        alt="Test image"
        caption="Image: Somewhere, CA"
      />
    );

    // Overscanning the layer would close the gap too, but `object-cover` would
    // then upscale the 1127x678 source and soften it.
    expect(screen.getByAltText('Test image').parentElement).toHaveClass(
      'inset-0'
    );
  });

  test('does not render landmark roles to avoid duplicate banner landmarks', () => {
    render(<HeaderImg src="/test-image.jpg" alt="Test image" />);

    const image = screen.getByAltText('Test image');
    const wrapper = image.parentElement?.parentElement;

    expect(wrapper).not.toHaveAttribute('role');
    expect(wrapper).not.toHaveAttribute('aria-label');
  });
});
