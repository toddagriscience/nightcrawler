import { render, screen } from '@testing-library/react';
import AuthCodeError from './page';
import { describe, test, expect } from 'vitest';

describe('AuthCodeError', () => {
  test('should render the correct title and message', () => {
    render(<AuthCodeError />);

    expect(
      screen.getByRole('heading', { name: /AUTH CODE ERROR/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/There was an error with your authentication code./i)
    ).toBeInTheDocument();
  });

  test('should render the HOME button', () => {
    render(<AuthCodeError />);

    expect(screen.getByRole('button', { name: /RETRY/i })).toBeInTheDocument();
  });
});
