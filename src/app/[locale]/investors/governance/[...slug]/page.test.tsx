// Copyright Todd LLC, All rights reserved.

import { PageHero } from '@/components/common';
import governanceTeam from '@/data/governance-team.json';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { TeamMemberCard } from '../components';
import type { TeamMember } from '../components/team-member-card/types/team-member-card';

describe('GovernancePage Components', () => {
  it('renders PageHero with Vincent Todd information', () => {
    const vincentTodd = (governanceTeam as Record<string, TeamMember>)[
      'vincent-todd'
    ];

    renderWithNextIntl(
      <PageHero
        title={vincentTodd.name}
        subtitle={vincentTodd.title}
        showArrow={false}
      />
    );

    expect(screen.getByTestId('page-hero')).toBeInTheDocument();
    expect(screen.getByText('Vincent Todd')).toBeInTheDocument();
    expect(screen.getByText('Chairman & CEO')).toBeInTheDocument();
  });

  it('renders TeamMemberCard with team member data', () => {
    const vincentTodd = (governanceTeam as Record<string, TeamMember>)[
      'vincent-todd'
    ];

    renderWithNextIntl(<TeamMemberCard teamMember={vincentTodd} />);

    expect(screen.getByTestId('team-member-card')).toBeInTheDocument();
    expect(screen.getByText('Vincent Todd')).toBeInTheDocument();
    expect(screen.getByText('Chairman & CEO')).toBeInTheDocument();
  });

  it('renders TeamMemberCard with Vincent Todd bio paragraphs using regex', () => {
    const vincentTodd = (governanceTeam as Record<string, TeamMember>)[
      'vincent-todd'
    ];

    renderWithNextIntl(<TeamMemberCard teamMember={vincentTodd} />);

    // Test for key phrases from Vincent Todd's bio using regex
    expect(screen.getByText(/Chairman and CEO of Todd/)).toBeInTheDocument();
    expect(
      screen.getByText(/Managing Partner of Todd Capital/)
    ).toBeInTheDocument();
  });

  it('renders TeamMemberCard with Lawrence Wilson bio paragraphs using regex', () => {
    const lawrenceWilson = (governanceTeam as Record<string, TeamMember>)[
      'lawrence-wilson'
    ];

    renderWithNextIntl(<TeamMemberCard teamMember={lawrenceWilson} />);

    expect(screen.getByText(/Senior Advisor at Todd/)).toBeInTheDocument();
    expect(
      screen.getByText(/Center for Development Foundation in Prescott, AZ/)
    ).toBeInTheDocument();
    expect(screen.getByText(/nutrition consultant/)).toBeInTheDocument();
    expect(
      screen.getByText(/Massachusetts Institute of Technology/)
    ).toBeInTheDocument();
  });

  it('renders TeamMemberCard with Brandy Beem bio paragraphs using regex', () => {
    const brandyBeem = (governanceTeam as Record<string, TeamMember>)[
      'brandy-beem'
    ];

    renderWithNextIntl(<TeamMemberCard teamMember={brandyBeem} />);

    expect(screen.getByText(/Senior Advisor at Todd/)).toBeInTheDocument();
    expect(
      screen.getByText(/Orthomolecular medicine practice/)
    ).toBeInTheDocument();
    expect(screen.getByText(/launched in April of 2014/)).toBeInTheDocument();
    expect(
      screen.getByText(/Biodynamic Demeter Association.*Institute of Justice/)
    ).toBeInTheDocument();
  });

  it('has correct governance team data structure', () => {
    const vincentTodd = (governanceTeam as Record<string, TeamMember>)[
      'vincent-todd'
    ];
    const lawrenceWilson = (governanceTeam as Record<string, TeamMember>)[
      'lawrence-wilson'
    ];
    const brandyBeem = (governanceTeam as Record<string, TeamMember>)[
      'brandy-beem'
    ];

    expect(vincentTodd).toBeDefined();
    expect(vincentTodd.name).toBe('Vincent Todd');
    expect(vincentTodd.title).toBe('Chairman & CEO');

    expect(lawrenceWilson).toBeDefined();
    expect(lawrenceWilson.name).toBe('Lawrence Wilson');
    expect(lawrenceWilson.title).toBe('Senior Advisor');

    expect(brandyBeem).toBeDefined();
    expect(brandyBeem.name).toBe('Brandy Beem');
    expect(brandyBeem.title).toBe('Senior Advisor');
  });
});
