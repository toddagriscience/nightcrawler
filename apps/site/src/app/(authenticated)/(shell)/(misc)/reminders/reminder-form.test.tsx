// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReminderForm } from './reminder-form';

// Stub the server actions so nothing reaches the db module.
vi.mock('./actions', () => ({
  createReminder: vi.fn().mockResolvedValue(undefined),
  updateReminderById: vi.fn().mockResolvedValue(undefined),
}));

// next/navigation's useRouter is needed by the form.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe('ReminderForm seasonal/exact-date mutual exclusion', () => {
  it('disables the Exact Date input once a Seasonal Label is typed', async () => {
    const user = userEvent.setup();
    render(<ReminderForm onSuccess={vi.fn()} />);

    const seasonal = screen.getByLabelText(/seasonal label/i);
    const exactDate = screen.getByLabelText(/exact date/i);

    expect(exactDate).not.toBeDisabled();

    await user.type(seasonal, 'early spring');

    expect(exactDate).toBeDisabled();
    expect(seasonal).not.toBeDisabled();
  });

  it('disables the Seasonal Label input once an Exact Date is set', async () => {
    const user = userEvent.setup();
    render(<ReminderForm onSuccess={vi.fn()} />);

    const seasonal = screen.getByLabelText(/seasonal label/i);
    const exactDate = screen.getByLabelText(/exact date/i);

    expect(seasonal).not.toBeDisabled();

    await user.type(exactDate, '2026-06-15');

    expect(seasonal).toBeDisabled();
    expect(exactDate).not.toBeDisabled();
  });
});
