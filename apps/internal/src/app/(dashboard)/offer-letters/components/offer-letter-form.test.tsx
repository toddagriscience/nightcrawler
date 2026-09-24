// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import OfferLetterForm from './offer-letter-form';

vi.mock('../actions', () => ({
  generateOfferLetter: vi.fn(),
}));

describe('OfferLetterForm', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows editable packet dates and location with defaults', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-16T12:00:00Z'));

    render(<OfferLetterForm />);

    expect(screen.getByLabelText('Letter Date')).toHaveValue('2026-09-16');
    expect(screen.getByLabelText('Accept By')).toHaveValue('2026-09-16');
    expect(screen.getByLabelText('Start Date')).toHaveValue('2026-09-16');
    expect(screen.getByLabelText('End Date')).toHaveValue('2026-09-16');
    expect(screen.getByLabelText('Location')).toHaveValue(
      'Los Angeles, CA/Remote'
    );
  });
});
