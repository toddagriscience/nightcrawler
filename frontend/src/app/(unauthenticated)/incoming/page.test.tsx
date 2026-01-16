// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Onboarding from './page';
import OnboardingForm from './components/onboarding-form';

// Mock useSearchParams from next/navigation
const mockGet = vi.fn();
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
}));

describe('Onboarding Page', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockClear();
  });

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

  it('calls router.push with correct URL parameters on form submission', async () => {
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

    const submitButton = screen.getByText('CONFIRM INFORMATION');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      const calledUrl = mockPush.mock.calls[0][0];
      expect(calledUrl).toContain('/join?');
      expect(calledUrl).toContain('first_name=John');
      expect(calledUrl).toContain('last_name=Doe');
      expect(calledUrl).toContain('farm_name=Green+Acres');
      expect(calledUrl).toContain('email=john%40example.com');
      expect(calledUrl).toContain('phone=5551234567');
    });
  });
});
