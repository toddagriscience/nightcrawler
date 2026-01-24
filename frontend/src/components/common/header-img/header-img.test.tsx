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
  }) => <img src={src} alt={alt} className={className} {...props} />,
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
    expect(image.closest('div')).toHaveClass('test-wrapper');
  });
});
