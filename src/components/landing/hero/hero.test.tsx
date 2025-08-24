import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from './hero';

describe('Hero', () => {
  it('renders without crashing', () => {
    render(<Hero />);
    expect(
      screen.getByText('Creating the next-generation organic farms')
    ).toBeInTheDocument();
  });

  it('displays the hero heading content', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      'Creating the next-generation organic farms'
    );
  });
});
