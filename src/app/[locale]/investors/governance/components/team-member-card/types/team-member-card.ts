// Copyright (c) Todd Agriscience, Inc. All rights reserved.

export interface TeamMember {
  name: string;
  title: string;
  bio: string[];
}

export interface TeamMemberCardProps {
  teamMember: TeamMember;
}
