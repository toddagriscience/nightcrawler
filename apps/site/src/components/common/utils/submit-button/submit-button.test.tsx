// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vitest } from 'vitest';
import SubmitButton from './submit-button';

describe('submit button', () => {
  it('renders without exploding and taking the whole world with it', () => {
    render(<SubmitButton buttonText="TEST" />);

    expect(screen.getByText('TEST')).toBeInTheDocument();
  });
  it('applies custom class names', () => {
    render(<SubmitButton buttonText="TEST" className="bg-black" />);

    expect(screen.getByText('TEST')).toHaveClass('bg-black');
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
  it('handles cooldown appropriately', async () => {
    const onClickFunction = vitest.fn();
    const cooldownClickHandler = vitest.fn();
    render(
      <SubmitButton
        buttonText="TEST"
        onClickFunction={onClickFunction}
        cooldownClickHandler={cooldownClickHandler}
      />
    );

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(() => {
      expect(onClickFunction).toHaveBeenCalledOnce();
    });

    userEvent.click(button);

    await waitFor(() => {
      expect(onClickFunction).toHaveBeenCalledTimes(2);
      expect(cooldownClickHandler).toHaveBeenCalledOnce();
    });
  });
});
