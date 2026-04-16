// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import WordmarkImage from './wordmark-image';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    className,
    priority,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      data-priority={priority === true ? 'true' : 'false'}
      data-fill={_fill === true ? 'true' : 'false'}
      data-sizes={_sizes}
      {...rest}
    />
  ),
}));

describe('WordmarkImage', () => {
  it('renders image with src and alt', () => {
    render(
      <WordmarkImage src="/marketing/brand/brand-0.png" alt="Todd Wordmark" />
    );

    const img = screen.getByRole('img', { name: 'Todd Wordmark' });
    expect(img).toHaveAttribute('src', '/marketing/brand/brand-0.png');
    expect(img).toHaveAttribute('data-fill', 'true');
    expect(img).toHaveClass('!relative', 'object-contain');
  });

  it('renders caption when provided and omits caption element when absent', () => {
    const { rerender, container } = render(
      <WordmarkImage src="/x.png" alt="A" caption="Caption under image" />
    );

    expect(screen.getByText('Caption under image')).toBeInTheDocument();
    expect(screen.getByText('Caption under image').tagName).toBe('P');

    rerender(<WordmarkImage src="/x.png" alt="A" />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('merges className on the outer wrapper', () => {
    const { container } = render(
      <WordmarkImage src="/x.png" alt="A" className="max-w-[600px] mb-4" />
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('flex', 'flex-col', 'max-w-[600px]', 'mb-4');
  });

  it('passes priority to NextImage when true', () => {
    render(<WordmarkImage src="/x.png" alt="A" priority />);

    expect(screen.getByRole('img')).toHaveAttribute('data-priority', 'true');
  });

  it('does not set priority on NextImage by default', () => {
    render(<WordmarkImage src="/x.png" alt="A" />);

    expect(screen.getByRole('img')).toHaveAttribute('data-priority', 'false');
  });
});
