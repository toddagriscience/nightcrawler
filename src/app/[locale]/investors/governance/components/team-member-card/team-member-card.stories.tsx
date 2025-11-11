// Copyright Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TeamMemberCard from './team-member-card';
import { TeamMember } from './types/team-member-card';

const meta: Meta<typeof TeamMemberCard> = {
  title: 'Governance/TeamMemberCard',
  component: TeamMemberCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTeamMember: TeamMember = {
  name: 'Vincent Todd',
  title: 'Chairman & CEO',
  bio: [
    'Vincent Todd is Chairman and CEO of Todd, the most successful sustainable-oriented agriculture firm in the United States, and leads across all global markets.',
    'Born to a working-poor family in Allen County, Indiana on November 10, 2002, Mr. Todd attended school until Christmas of 3rd grade, later attending only months of 5th and 6th grade in Asheville, North Carolina, and Applegate, California.',
    'He began his professional career in 2018 as a seedsman selling to regional farms and gardeners. He previously founded a nonprofit Native American seed bank in 2017 which to this day maintains over 800 critically endangered food crops from the U.S. and northwest Mexico.',
  ],
};

export const Default: Story = {
  args: {
    teamMember: sampleTeamMember,
  },
};

export const ShortBio: Story = {
  args: {
    teamMember: {
      name: 'Jane Smith',
      title: 'Senior Advisor',
      bio: [
        'Jane Smith is a Senior Advisor at Todd with extensive experience in sustainable agriculture.',
        'She has been instrumental in developing our nutritional research programs.',
      ],
    },
  },
};

export const LongBio: Story = {
  args: {
    teamMember: {
      name: 'Dr. Lawrence Wilson',
      title: 'Senior Advisor',
      bio: [
        'Dr. Lawrence Wilson is a Senior Advisor at Todd. Lawrence was most recently the Founder and President of the Center for Development Foundation in Prescott, AZ.',
        'During his 40 years as a nutrition consultant, researcher and author, he developed the nutritional development program and authored 7 books and over 1800 articles related to health and lifestyle.',
        'Prior to The Center for Development Foundation, Lawrence was a consultant for Analytical Research Laboratories in Phoenix, Arizona.',
        'Lawrence is currently on the Board of the Center for Development Foundation, and in the past has held positions on the non-profit boards of: The Shanti Wellness Clinic, the Task Force on Nutrition of the Ohio Regional Health Planning Association, and the Cincinnati Council to Promote Health and Well Being.',
        'Lawrence has consistently been recognized as a leader in advanced nutrition research. In 1979, he was awarded a medical degree from his alma mater, Universidad Autonoma Del Estado De Guerrero.',
      ],
    },
  },
};
