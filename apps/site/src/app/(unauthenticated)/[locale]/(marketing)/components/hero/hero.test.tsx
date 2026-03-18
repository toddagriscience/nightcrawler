// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import Hero from './hero';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('Hero', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<Hero />);
    expect(
      screen.getByText('We help regenerate sustainable farms.')
    ).toBeInTheDocument();
  });

  it('displays the hero heading content', () => {
    renderWithNextIntl(<Hero />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('We help regenerate sustainable farms.');
  });
});
