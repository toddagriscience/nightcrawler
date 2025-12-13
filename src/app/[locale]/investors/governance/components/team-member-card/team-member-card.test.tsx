// Copyright Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import TeamMemberCard from './team-member-card';
import { TeamMember } from './types/team-member-card';
import { describe, it, expect } from 'vitest';

const mockTeamMember: TeamMember = {
  name: 'John Doe',
  title: 'CEO',
  bio: [
    'First paragraph of bio.',
    'Second paragraph of bio.',
    'Third paragraph of bio.',
  ],
};

describe('TeamMemberCard', () => {
  it('renders team member information correctly', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />);

    expect(screen.getByText('First paragraph of bio.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph of bio.')).toBeInTheDocument();
    expect(screen.getByText('Third paragraph of bio.')).toBeInTheDocument();
  });

  it('renders all bio paragraphs', () => {
    render(<TeamMemberCard teamMember={mockTeamMember} />);

    const paragraphs = screen.getAllByText(/paragraph of bio/);
    expect(paragraphs).toHaveLength(3);
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <TeamMemberCard teamMember={mockTeamMember} />
    );

    const cardContainer = container.querySelector(
      '.flex.justify-end.items-start'
    );
    expect(cardContainer).toBeInTheDocument();

    const contentDiv = container.querySelector('.w-full.md\\:w-1\\/2');
    expect(contentDiv).toBeInTheDocument();
  });
});
