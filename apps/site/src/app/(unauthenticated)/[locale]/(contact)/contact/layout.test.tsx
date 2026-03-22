// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContactLayout from './layout';

describe('ContactLayout', () => {
  it('renders children', () => {
    render(
      <ContactLayout>
        <div data-testid="child-content">Child Content</div>
      </ContactLayout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});
