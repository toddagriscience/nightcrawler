// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import GoFooter from './footer';

describe('GoFooter', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<GoFooter />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays copyright text', () => {
    renderWithNextIntl(<GoFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© Todd Agriscience ${currentYear}`)
    ).toBeInTheDocument();
  });

  it('includes legal links', () => {
    renderWithNextIntl(<GoFooter />);
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Disclosures')).toBeInTheDocument();
    expect(screen.getByText('Vulnerability Reporting')).toBeInTheDocument();
  });

  it('has social media links with accessible names', () => {
    renderWithNextIntl(<GoFooter />);
    expect(
      screen.getByRole('link', { name: 'Visit our X (Twitter) page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Visit our Instagram page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Visit our LinkedIn page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Visit our YouTube channel' })
    ).toBeInTheDocument();
  });
});
