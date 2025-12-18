// Copyright © Todd Agriscience, Inc. All rights reserved.

import { screen, fireEvent, renderWithNextIntl } from '@/test/test-utils';
import Header from './header';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('Header', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays menu toggle button', () => {
    renderWithNextIntl(<Header />);
    expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
  });

  it('shows TODD wordmarks when not in menu mode', () => {
    renderWithNextIntl(<Header alwaysGlassy />);
    expect(screen.getAllByTestId('wordmark-link')).toHaveLength(2);
  });

  it('toggles menu when menu button is clicked', async () => {
    renderWithNextIntl(<Header />);
    const menuButton = screen.getByTestId('menu-toggle');

    await fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    await fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('supports keyboard navigation for menu toggle', async () => {
    renderWithNextIntl(<Header />);
    const menuButton = screen.getByTestId('menu-toggle');

    await fireEvent.keyDown(menuButton, { key: 'Enter' });
    expect(menuButton).toHaveAttribute('aria-label', 'Close menu');

    await fireEvent.keyDown(menuButton, { key: ' ' });
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('includes Login link', () => {
    renderWithNextIntl(<Header />);

    // Check login link
    const loginLink = screen.getAllByTestId('login-link')[0];
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('renders normally without isLoading prop', () => {
    renderWithNextIntl(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
  });
});
