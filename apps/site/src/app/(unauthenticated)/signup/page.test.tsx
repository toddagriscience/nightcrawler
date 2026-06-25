// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signUp } from './actions';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import SignupForm from './components/signup-form';

global.ResizeObserver = ResizeObserver;

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
  const prefill = {
    firstName: 'John',
    lastName: 'Doe',
    farmName: 'Green Acres',
    email: 'john@example.com',
    phone: '+15551234567',
    applicationId: '42',
    token: 'test-signup-token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('approved-applicant password form', () => {
    it('renders when server prefill is provided', () => {
      render(<SignupForm prefill={prefill} />);

      expect(screen.getByText('Create your password')).toBeInTheDocument();
      expect(
        screen.getByText(/Choose a password for john@example.com/)
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Create a Password')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('includes hidden fields with server prefill values', () => {
      const { container } = render(<SignupForm prefill={prefill} />);

      expect(container.querySelector('input[name="firstName"]')).toHaveValue(
        'John'
      );
      expect(container.querySelector('input[name="farmName"]')).toHaveValue(
        'Green Acres'
      );
    });

    it('shows errors when signup action fails', async () => {
      vi.mocked(signUp).mockRejectedValue(new Error('Invalid link'));
      vi.mocked(formatActionResponseErrors).mockReturnValue(['Invalid link']);

      const user = userEvent.setup();
      render(<SignupForm prefill={prefill} />);

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
