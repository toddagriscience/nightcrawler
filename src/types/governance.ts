// Copyright Todd LLC, All rights reserved.

export interface TeamMember {
  name: string;
  title: string;
  bio: string[];
}

export interface GovernanceTeam {
  [key: string]: TeamMember;
}
