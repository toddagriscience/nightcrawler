// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import OnboardingForm from './onboarding-form';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
}));

describe('OnboardingForm component', () => {
  it('navigates to localized signup with URL parameters on form submission', async () => {
    mockPush.mockClear();

    render(
      <OnboardingForm
        firstName="Jane"
        lastName="Smith"
        farmName="Sunny Farms"
        email="jane@sunny.com"
        phone="5559876543"
      />
    );

    const submitButton = screen.getByText('CONFIRM INFORMATION');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      const calledUrl = mockPush.mock.calls[0][0];
      expect(calledUrl).toContain('/en/signup?');
      expect(calledUrl).toContain('first_name=Jane');
      expect(calledUrl).toContain('last_name=Smith');
      expect(calledUrl).toContain('farm_name=Sunny+Farms');
      expect(calledUrl).toContain('email=jane%40sunny.com');
      expect(calledUrl).toContain('phone=5559876543');
    });
  });

  it('navigates with updated values when form is edited', async () => {
    const user = userEvent.setup();
    mockPush.mockClear();

    render(
      <OnboardingForm
        firstName="Jane"
        lastName="Smith"
        farmName="Sunny Farms"
        email="jane@sunny.com"
        phone="5559876543"
      />
    );

    const firstNameInput = screen.getByPlaceholderText('First Name');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Janet');

    const farmNameInput = screen.getByPlaceholderText('Farm Name');
    await user.clear(farmNameInput);
    await user.type(farmNameInput, 'New Farm Name');

    const submitButton = screen.getByText('CONFIRM INFORMATION');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      const calledUrl = mockPush.mock.calls[0][0];
      expect(calledUrl).toContain('/en/signup?');
      expect(calledUrl).toContain('first_name=Janet');
      expect(calledUrl).toContain('farm_name=New+Farm+Name');
    });
  });
});
