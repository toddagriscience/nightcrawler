// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './header';

describe('GoHeader', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
  it('displays the page title', () => {
    render(<Header />);
    expect(screen.getByText('Creator Program')).toBeInTheDocument();
  });
});
