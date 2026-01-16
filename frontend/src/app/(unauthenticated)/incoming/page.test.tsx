// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import Onboarding from './page';

// Mock useSearchParams from next/navigation
const mockGet = vi.fn();
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
}));

describe('Onboarding Page', () => {
  it('renders without crashing', () => {
    mockGet.mockReturnValue(null);

    render(<Onboarding />);

    expect(screen.getByText("Let's get started.")).toBeInTheDocument();
    expect(
      screen.getByText('Is this the correct information?')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Farm Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
  });

  it('autofills fields from URL parameters', () => {
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        first_name: 'John',
        last_name: 'Doe',
        farm_name: 'Green Acres',
        email: 'john@example.com',
        phone: '5551234567',
      };
      return params[key] || null;
    });

    render(<Onboarding />);

    expect(screen.getByPlaceholderText('First Name')).toHaveValue('John');
    expect(screen.getByPlaceholderText('Last Name')).toHaveValue('Doe');
    expect(screen.getByPlaceholderText('Farm Name')).toHaveValue('Green Acres');
    expect(screen.getByPlaceholderText('Email')).toHaveValue(
      'john@example.com'
    );
    expect(screen.getByPlaceholderText('Phone Number')).toHaveValue(
      '5551234567'
    );
  });
});
