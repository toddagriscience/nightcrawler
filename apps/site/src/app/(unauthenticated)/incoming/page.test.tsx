// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import Onboarding from './page';

vi.mock('./components/onboarding-form', () => ({
  default: ({
    firstName,
    lastName,
    farmName,
    email,
    phone,
    applicationId,
    token,
  }: {
    firstName: string;
    lastName: string;
    farmName: string;
    email: string;
    phone: string;
    applicationId?: string;
    token?: string;
  }) => (
    <div>
      <span>incoming-form</span>
      <span>{firstName}</span>
      <span>{lastName}</span>
      <span>{farmName}</span>
      <span>{email}</span>
      <span>{phone}</span>
      <span>{applicationId}</span>
      <span>{token}</span>
    </div>
  ),
}));

describe('Onboarding Page', () => {
  it('passes search params to the onboarding form', async () => {
    const ui = await Onboarding({
      searchParams: Promise.resolve({
        first_name: 'John',
        last_name: 'Doe',
        farm_name: 'Green Acres',
        email: 'john@example.com',
        phone: '5551234567',
        application_id: '42',
        token: 'abc',
      }),
    });

    render(ui);

    expect(screen.getByText('incoming-form')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Green Acres')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('5551234567')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('abc')).toBeInTheDocument();
  });
});
