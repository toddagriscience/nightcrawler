// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen } from '@testing-library/react';
import Link from 'next/link';
import { describe, expect, it, vi } from 'vitest';
import { OutlinePillButton } from './outline-pill-button';

describe('OutlinePillButton', () => {
  it('supports an action and its disabled state', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <OutlinePillButton onClick={onClick}>Continue</OutlinePillButton>
    );
    const button = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    rerender(
      <OutlinePillButton disabled onClick={onClick}>
        Continue
      </OutlinePillButton>
    );
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toBeDisabled();
  });

  it('renders a link without a nested button and preserves its destination', () => {
    render(
      <OutlinePillButton asChild>
        <Link href="/research">Explore research</Link>
      </OutlinePillButton>
    );
    const link = screen.getByRole('link', { name: 'Explore research' });
    expect(link).toHaveAttribute('href', '/research');
    expect(link).toHaveClass('rounded-full', 'text-sm', 'h-[42px]');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
