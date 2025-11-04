// Copyright Todd LLC, All rights reserved.

'use client';

import { TeamMemberCardProps } from './types/team-member-card';

/**
 * Team member card component for displaying governance team member information
 * @param {TeamMemberCardProps} props - The component props
 * @returns {JSX.Element} - The team member card component
 */
const TeamMemberCard = ({ teamMember }: TeamMemberCardProps) => {
  return (
    <div
      data-testid="team-member-card"
      className="flex justify-end items-start w-full"
    >
      <div className="w-full md:w-1/2">
        <hr className="border-t border-gray-300 my-6 pb-6" />

        <div className="space-y-6 text-lg leading-relaxed text-foreground">
          {teamMember.bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
