// Copyright © Todd Agriscience, Inc. All rights reserved.



import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import CreatorsPage from './page';

describe('CreatorsPage', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('has an Apply link', () => {
    renderWithNextIntl(<CreatorsPage />);
    const applyLinks = screen.getAllByRole('link', { name: /apply/i });
    expect(applyLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Creator Program section', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('Creator Program')).toBeInTheDocument();
    expect(screen.getByText('Apply Now')).toBeInTheDocument();
  });

  it('renders the How it works section', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(
      screen.getByText(/Access the Supplier and Business Partner/)
    ).toBeInTheDocument();
  });

  it('renders the Benefits section with all four items', () => {
    renderWithNextIntl(<CreatorsPage />);
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('Firm Representation')).toBeInTheDocument();
    expect(screen.getByText('Team Focus')).toBeInTheDocument();
    expect(
      screen.getByText('Farm Alignment and Integration')
    ).toBeInTheDocument();
    expect(screen.getByText('Broader Communities')).toBeInTheDocument();
  });
});
