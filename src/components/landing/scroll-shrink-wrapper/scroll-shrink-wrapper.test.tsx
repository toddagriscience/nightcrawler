// Copyright Todd LLC, All rights reserved.

import React from 'react';
import { render, screen } from '@testing-library/react';
import ScrollShrinkWrapper from './scroll-shrink-wrapper';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useScroll: jest.fn(() => ({ scrollYProgress: 0 })),
  useTransform: jest.fn(() => '100vw'),
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
      <ScrollShrinkWrapper>
        <div data-testid="test-child">Test content</div>
        <span data-testid="another-child">Another element</span>
      </ScrollShrinkWrapper>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('another-child')).toBeInTheDocument();
  });
});
