// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen } from '@/test/test-utils';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmitButton from './submit-button';
import userEvent from '@testing-library/user-event';
import { it, describe, expect, vitest } from 'vitest';

describe('submit button', () => {
  it('renders without exploding and taking the whole world with it', () => {
    render(<SubmitButton buttonText="TEST" />);

    expect(screen.getByText('TEST')).toBeInTheDocument();
  });
  it('applies custom class names', () => {
    render(<SubmitButton buttonText="TEST" className="bg-amber-50" />);

    expect(screen.getByText('TEST')).toHaveClass('bg-amber-50');
  });
  it('calls given function correctly', async () => {
    const testFn = vitest.fn();
    render(<SubmitButton buttonText="TEST" onClickFunction={testFn} />);

    userEvent.click(screen.getByText('TEST'));

    await waitFor(() => {
      expect(testFn).toHaveBeenCalled();
    });
  });
  it('disables when disabled', () => {
    const testFn = vitest.fn();
    render(
      <SubmitButton
        buttonText="TEST"
        onClickFunction={testFn}
        disabled={true}
      />
    );

    expect(screen.getByText('TEST')).toBeDisabled();
  });
});
