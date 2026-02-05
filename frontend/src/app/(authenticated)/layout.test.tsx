// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AuthenticatedLayout from './layout';

vi.mock(
  '@/components/common/authenticated-header/authenticated-header',
  () => ({
    default: () => <div data-testid="authenticated-header" />,
  })
);

vi.mock('next/font/local', () => ({
  default: () => ({
    className: 'mock-font',
    variable: 'mock-font-variable',
  }),
}));

describe('AuthenticatedLayout', () => {
  it('should render "authenticated-root" class', () => {
    render(
      <AuthenticatedLayout>
        <div data-testid="child-content">Child Content</div>
      </AuthenticatedLayout>
    );

    const childContent = screen.getByTestId('child-content');
    const wrapper = childContent.parentElement;

    expect(wrapper).toHaveClass('authenticated-root');
    expect(wrapper).toHaveClass('min-h-screen');
    expect(wrapper).toHaveClass('bg-background-platform');
  });

  it('should render children and header', () => {
    render(
      <AuthenticatedLayout>
        <div data-testid="child-content">Child Content</div>
      </AuthenticatedLayout>
    );

    expect(screen.getByTestId('authenticated-header')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});
