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
  };

  beforeEach(() => {
    mockGet.mockClear();
  });

  describe('form loading with search params', () => {
    it('renders the form correctly when all params are present', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      render(<SignupForm isApprovedApplicantSignup={false} />);

      expect(screen.getByText("You're Almost There!")).toBeInTheDocument();
      expect(
        screen.getByText(
          "You'll use this to login and access your Todd account in the future."
        )
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Create a Password')).toBeInTheDocument();

      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('includes hidden fields with pre-filled values from search params', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      const { container } = render(
        <SignupForm isApprovedApplicantSignup={false} />
      );

      expect(container.querySelector('input[name="firstName"]')).toHaveValue(
        'John'
      );
      expect(container.querySelector('input[name="lastName"]')).toHaveValue(
        'Doe'
      );
      expect(container.querySelector('input[name="farmName"]')).toHaveValue(
        'Green Acres'
      );
      expect(container.querySelector('input[name="email"]')).toHaveValue(
        'john@example.com'
      );
      expect(container.querySelector('input[name="phone"]')).toHaveValue(
        '5551234567'
      );
    });

    it('displays password checklist requirements', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      render(<SignupForm isApprovedApplicantSignup={false} />);

      expect(
        screen.getByText(
          /Please make sure to use a secure password matching the rules./
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/at least 8 characters/)).toBeInTheDocument();
      expect(
        screen.getByText(/contains a special character/)
      ).toBeInTheDocument();
      expect(screen.getByText(/contains a number/)).toBeInTheDocument();
      expect(
        screen.getByText(/contains an uppercase letter/)
      ).toBeInTheDocument();
      expect(screen.getByText(/passwords match/)).toBeInTheDocument();
    });
  });

  describe('success screen', () => {
    it('shows success screen when action returns without an error', async () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);
      vi.mocked(signUp).mockResolvedValue({
        data: { user: {}, farm: {} },
      });

      const user = userEvent.setup();
      render(<SignupForm isApprovedApplicantSignup={false} />);

      const validPassword = 'P@ssword1';
      await user.type(
        screen.getByLabelText('Create a Password'),
        validPassword
      );
      await user.type(screen.getByLabelText('Confirm Password'), validPassword);
      await user.click(screen.getByRole('button', { name: 'Continue' }));

      await waitFor(() => {
        expect(
          screen.getByText('Your Todd Account Has Been Created!')
        ).toBeInTheDocument();
      });
      expect(
        screen.getByText('Please check your email to activate your account:')
      ).toBeInTheDocument();

      expect(
        screen.queryByText("You're Almost There!")
      ).not.toBeInTheDocument();
    });

    it('shows form when action has not been submitted yet', () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);

      render(<SignupForm isApprovedApplicantSignup={false} />);

      expect(screen.getByText("You're Almost There!")).toBeInTheDocument();
      expect(
        screen.queryByText('Your Todd Account Has Been Created!')
      ).not.toBeInTheDocument();
    });

    it('shows form with errors when action returns with an error', async () => {
      mockGet.mockImplementation((key: string) => validParams[key] || null);
      vi.mocked(signUp).mockRejectedValue(new Error('User already exists'));
      vi.mocked(formatActionResponseErrors).mockReturnValue([
        'User already exists',
      ]);

      const user = userEvent.setup();
      render(<SignupForm isApprovedApplicantSignup={false} />);

      const validPassword = 'P@ssword1';
      await user.type(
        screen.getByLabelText('Create a Password'),
        validPassword
      );
      await user.type(screen.getByLabelText('Confirm Password'), validPassword);
      await user.click(screen.getByRole('button', { name: 'Continue' }));

      await waitFor(() => {
        expect(screen.getByText('User already exists')).toBeInTheDocument();
      });

      expect(screen.getByText("You're Almost There!")).toBeInTheDocument();

      expect(
        screen.queryByText('Your Todd Account Has Been Created!')
      ).not.toBeInTheDocument();
    });
  });
});
