// Copyright Todd Agriscience, Inc. All rights reserved.

import { screen, renderWithNextIntl } from '@/test/test-utils';
import CareersPage from './page';
import '@testing-library/jest-dom';

describe('CareersPage', () => {
  it('renders the page', () => {
    renderWithNextIntl(<CareersPage />);
    expect(screen.getByText('Careers')).toBeInTheDocument();

    expect(screen.getByText('Join Our Team')).toBeInTheDocument();

    expect(
      screen.getByText(
        "At Todd Agriscience, we're committed to advancing agricultural science and creating sustainable solutions for the future. We're always looking for talented individuals who share our passion for innovation and excellence."
      )
    ).toBeInTheDocument();
  });

  it('renders the Why Join Us section', () => {
    renderWithNextIntl(<CareersPage />);

    expect(screen.getByText('Why Join Us')).toBeInTheDocument();
    expect(screen.getByText('Innovation')).toBeInTheDocument();
    expect(screen.getByText('Professional Growth')).toBeInTheDocument();
    expect(screen.getByText('Collaborative Culture')).toBeInTheDocument();
    expect(screen.getByText('Global Impact')).toBeInTheDocument();
  });

  it('renders the Open Positions section', () => {
    renderWithNextIntl(<CareersPage />);

    expect(screen.getByText('Open Positions')).toBeInTheDocument();
    expect(
      screen.getByText(
        "We don't have any open positions at this time, but we're always interested in hearing from talented individuals. Please check back soon or reach out to us directly."
      )
    ).toBeInTheDocument();
  });

  it('renders the How to Apply section', () => {
    renderWithNextIntl(<CareersPage />);

    expect(screen.getByText('How to Apply')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('has appropriate margins', () => {
    const { container } = renderWithNextIntl(<CareersPage />);
    expect(container.querySelector('.mt-16')).toBeInTheDocument();
  });

  it('has a link to the contact page', () => {
    renderWithNextIntl(<CareersPage />);
    const contactLink = screen.getByText('Contact Us');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
});
