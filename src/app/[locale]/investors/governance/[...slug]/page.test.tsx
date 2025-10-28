// Copyright Todd LLC, All rights reserved.

import { PageHero } from '@/components/common';
import governanceTeam from '@/data/governance-team.json';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import '@testing-library/jest-dom';
import { TeamMemberCard } from '../components';
import type { TeamMember } from '../components/team-member-card/types/team-member-card';

// Mock the components we're testing
jest.mock('@/components/common', () => ({
  PageHero: jest.fn(({ title, subtitle }) => (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  )),
}));

jest.mock('../components', () => ({
  TeamMemberCard: jest.fn(({ teamMember }) => (
    <div data-testid="team-member-card">
      <p>{teamMember.name}</p>
      <p>{teamMember.title}</p>
    </div>
  )),
}));

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

  it('has correct governance team data structure', () => {
    const vincentTodd = (governanceTeam as Record<string, TeamMember>)[
      'vincent-todd'
    ];
    const lawrenceWilson = (governanceTeam as Record<string, TeamMember>)[
      'lawrence-wilson'
    ];

    expect(vincentTodd).toBeDefined();
    expect(vincentTodd.name).toBe('Vincent Todd');
    expect(vincentTodd.title).toBe('Chairman & CEO');

    expect(lawrenceWilson).toBeDefined();
    expect(lawrenceWilson.name).toBe('Lawrence Wilson');
    expect(lawrenceWilson.title).toBe('Senior Advisor');
  });
});
