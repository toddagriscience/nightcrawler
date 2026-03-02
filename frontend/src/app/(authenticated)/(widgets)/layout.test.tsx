// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AuthenticatedHeaderLayout from './layout';

vi.mock(
  '@/components/common/authenticated-header/authenticated-header',
  () => ({
    default: () => <div data-testid="authenticated-header" />,
  })
);

describe('AuthenticatedHeaderLayout', () => {
  it('should render children and authenticated header', () => {
    render(
      <AuthenticatedHeaderLayout>
        <div data-testid="child-content">Child Content</div>
      </AuthenticatedHeaderLayout>
    );

    expect(screen.getByTestId('authenticated-header')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});
