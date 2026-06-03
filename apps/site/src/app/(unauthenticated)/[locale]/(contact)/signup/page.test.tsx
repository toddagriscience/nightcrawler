// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signUp } from './actions';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import SignupForm from './components/signup-form';

global.ResizeObserver = ResizeObserver;

const mockGet = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
  usePathname: () => '/signup',
}));

vi.mock('@/lib/utils/actions', () => ({
  formatActionResponseErrors: vi.fn(),
}));

vi.mock('./actions', () => ({
  signUp: vi.fn(),
}));

vi.mock('framer-motion', () => {
  const MockMotionComponent = ({
    children,
    ...props
  }: React.HTMLProps<HTMLDivElement>) => {
    return <div {...props}>{children}</div>;
  };

  return {
    motion: {
      div: MockMotionComponent,
      button: MockMotionComponent,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe('SignupForm', () => {
  const validParams: Record<string, string> = {
    first_name: 'John',
    last_name: 'Doe',
    farm_name: 'Green Acres',
    email: 'john@example.com',
    phone: '5551234567',
    application_id: '42',
    token: 'test-signup-token',
  };

  beforeEach(() => {
    mockGet.mockClear();
  });

  describe('form loading with search params', () => {
    it('renders the approved-applicant password form when all params are present', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      render(<SignupForm isApprovedApplicantSignup />);

      expect(screen.getByText('Create your password')).toBeInTheDocument();
      expect(
        screen.getByText(/Choose a password for john@example.com/)
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Create a Password')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('includes hidden fields with pre-filled values from search params', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      const { container } = render(<SignupForm isApprovedApplicantSignup />);

      expect(container.querySelector('input[name="firstName"]')).toHaveValue(
        'John'
      );
      expect(container.querySelector('input[name="applicationId"]')).toBeNull();
    });

    it('shows errors when signup action fails', async () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);
      vi.mocked(signUp).mockRejectedValue(new Error('Invalid link'));
      vi.mocked(formatActionResponseErrors).mockReturnValue(['Invalid link']);

      const user = userEvent.setup();
      render(<SignupForm isApprovedApplicantSignup />);

      const validPassword = 'P@ssword1';
      await user.type(
        screen.getByLabelText('Create a Password'),
        validPassword
      );
      await user.type(screen.getByLabelText('Confirm Password'), validPassword);
      await user.click(screen.getByRole('button', { name: 'Continue' }));

      await waitFor(() => {
        expect(screen.getByText('Invalid link')).toBeInTheDocument();
      });
    });
  });
});
