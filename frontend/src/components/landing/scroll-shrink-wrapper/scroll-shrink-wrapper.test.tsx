// Copyright © Todd Agriscience, Inc. All rights reserved.

import React from 'react';
import { render, screen } from '@testing-library/react';
import ScrollShrinkWrapper from './scroll-shrink-wrapper';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  ...vi.importActual('framer-motion'),
  useScroll: vi.fn(() => ({ scrollYProgress: 0 })),
  useTransform: vi.fn(() => '100vw'),
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
      function MockMotionDiv({ children, ...props }, ref) {
        return (
          <div ref={ref} {...props}>
            {children}
          </div>
        );
      }
    ),
  },
}));

describe('ScrollShrinkWrapper', () => {
  it('renders without crashing', () => {
    render(
      <ScrollShrinkWrapper>
        <div data-testid="test-child">Test content</div>
      </ScrollShrinkWrapper>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders children within the wrapper', () => {
    render(
      <ScrollShrinkWrapper stopWidth={400}>
        <div data-testid="test-child">Test content</div>
        <span data-testid="another-child">Another element</span>
      </ScrollShrinkWrapper>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('another-child')).toBeInTheDocument();
  });
});
