// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { IrisButton } from './iris-button';

describe('IrisButton', () => {
  it('renders a primary button by default', () => {
    render(<IrisButton>Button</IrisButton>);

    const button = screen.getByRole('button', { name: 'Button' });
    expect(button).toHaveClass(
      'rounded-md',
      'bg-[#181818]',
      'text-white',
      'hover:bg-[#181818]/90'
    );
    expect(
      button.querySelector('[aria-hidden="true"]')
    ).not.toBeInTheDocument();
  });

  it('renders the outline variant', () => {
    render(<IrisButton variant="outline">Button</IrisButton>);

    const button = screen.getByRole('button', { name: 'Button' });
    expect(button).toHaveClass(
      'border',
      'border-[#d8d8d8]',
      'bg-white',
      'hover:bg-[#d9d9d9]/15'
    );
    expect(
      button.querySelector('[aria-hidden="true"]')
    ).not.toBeInTheDocument();
  });

  it('renders the destructive variant', () => {
    render(<IrisButton variant="destructive">Delete</IrisButton>);

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'bg-destructive',
      'text-destructive-foreground',
      'hover:bg-destructive/90'
    );
  });

  it('merges a custom className', () => {
    render(
      <IrisButton className="w-full" variant="outline">
        Button
      </IrisButton>
    );

    expect(screen.getByRole('button', { name: 'Button' })).toHaveClass(
      'w-full',
      'border'
    );
  });

  it('runs onClick', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<IrisButton onClick={handleClick}>Button</IrisButton>);

    await user.click(screen.getByRole('button', { name: 'Button' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not run onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <IrisButton disabled onClick={handleClick}>
        Button
      </IrisButton>
    );

    const button = screen.getByRole('button', { name: 'Button' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
