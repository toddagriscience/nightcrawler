// Copyright Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import Quote from './quote';
import '@testing-library/jest-dom';

describe('Quote', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<Quote isDark={false} />);
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'about-us');
  });

  it('displays the about heading content', () => {
    renderWithNextIntl(<Quote isDark={false} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/sustainable agriculture/i);
  });

  it('renders the Learn More link with correct href', () => {
    renderWithNextIntl(<Quote isDark={false} />);
    const aboutLink = screen.getByTestId('button-component');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(aboutLink).toHaveTextContent('Learn More');
  });

  it('renders normally without isLoading prop', () => {
    renderWithNextIntl(<Quote />);
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  // TODO: Add Spanish translation tests when Jest/NextIntl integration is improved
});
