// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OfferLettersPage from './page';

vi.mock('./components/offer-letter-form', () => ({
  default: () => <div data-testid="offer-letter-form" />,
}));

describe('OfferLettersPage', () => {
  it('renders the offer packet generator', () => {
    render(<OfferLettersPage />);
    expect(
      screen.getByRole('heading', { name: 'Offer Letters' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/downloadable offer packet PDF/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('offer-letter-form')).toBeInTheDocument();
  });
});
