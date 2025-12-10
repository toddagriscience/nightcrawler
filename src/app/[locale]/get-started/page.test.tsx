// Copyright Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl, fireEvent } from '@/test/test-utils';
import GetStartedPage from './page';
import '@testing-library/jest-dom';

// Mock the PageHero component
jest.mock('@/components/common', () => ({
  PageHero: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="page-hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  FadeIn: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fade-in">{children}</div>
  ),
}));

describe('GetStartedPage', () => {
  it('renders the page hero section', () => {
    renderWithNextIntl(<GetStartedPage />);

    expect(screen.getByTestId('page-hero')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders the form with all required fields', () => {
    renderWithNextIntl(<GetStartedPage />);

    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('company-input')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
  });

  it('displays description text', () => {
    renderWithNextIntl(<GetStartedPage />);

    expect(
      screen.getByText(
        /Whether you're interested in regenerative agriculture practices/
      )
    ).toBeInTheDocument();
  });

  it('allows user to fill out form fields', () => {
    renderWithNextIntl(<GetStartedPage />);

    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const companyInput = screen.getByTestId(
      'company-input'
    ) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(companyInput, { target: { value: 'Test Company' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(companyInput.value).toBe('Test Company');
  });

  it('enforces character limit on message field', () => {
    renderWithNextIntl(<GetStartedPage />);

    const messageInput = screen.getByTestId(
      'message-input'
    ) as HTMLTextAreaElement;
    const longMessage = 'a'.repeat(2000); // Exceeds 1500 character limit

    fireEvent.change(messageInput, { target: { value: longMessage } });

    // Should only contain 1500 characters
    expect(messageInput.value.length).toBeLessThanOrEqual(1500);
  });

  it('displays character count for message field', () => {
    renderWithNextIntl(<GetStartedPage />);

    expect(screen.getByText(/0\/1500 characters/)).toBeInTheDocument();
  });

  it('shows submit button with correct text', () => {
    renderWithNextIntl(<GetStartedPage />);

    expect(
      screen.getByRole('button', { name: /Submit Inquiry/ })
    ).toBeInTheDocument();
  });

  it('has proper form structure', () => {
    const { container } = renderWithNextIntl(<GetStartedPage />);

    // Check for form element
    expect(container.querySelector('form')).toBeInTheDocument();

    // Check for required fields
    expect(container.querySelectorAll('input[required]').length).toBeGreaterThan(
      0
    );
  });
});
