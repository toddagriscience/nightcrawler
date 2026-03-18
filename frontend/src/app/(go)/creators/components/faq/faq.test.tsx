// Copyright © Todd Agriscience, Inc. All rights reserved.



import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Faq from './faq';

describe('Faq', () => {
  it('renders without crashing', () => {
    const { container } = render(<Faq />);
    expect(container).toBeInTheDocument();
  });

  it('renders the FAQ heading', () => {
    render(<Faq />);
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders at least one accordion item', () => {
    render(<Faq />);
    const triggers = screen.getAllByRole('button');
    expect(triggers.length).toBeGreaterThan(0);
  });

  it('expands an accordion item when clicked', async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const triggers = screen.getAllByRole('button');
    await user.click(triggers[0]);
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBe(1);
  });

  it('only allows one item open at a time', async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const triggers = screen.getAllByRole('button');
    await user.click(triggers[0]);
    await user.click(triggers[1]);
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBe(1);
  });
});
