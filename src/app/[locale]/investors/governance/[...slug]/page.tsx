// Copyright Todd LLC, All rights reserved.

import { PageHero } from '@/components/common';
import { ScrollShrinkWrapper } from '@/components/landing';
import governanceTeam from '@/data/governance-team.json';
import { env } from '@/lib/env';
import { createMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TeamMemberCard } from '../components';
import type { TeamMember } from '../components/team-member-card/types/team-member-card';

interface GovernancePageProps {
  params: { slug: string[]; locale: string };
}

/**
 * Generate metadata for governance team member pages
 * @param {GovernancePageProps} props - The page props
 * @returns {Metadata} - The metadata for the governance page
 */
export function generateMetadata({ params }: GovernancePageProps): Metadata {
  const { slug, locale } = params;
  const memberSlug = slug[0];

  // Get the team member data
  const teamMember = (governanceTeam as Record<string, TeamMember>)[memberSlug];

  if (!teamMember) {
    notFound();
  }

  // Use hardcoded title instead of translations to avoid async
  const governanceTitle =
    locale === 'es' ? 'Gobierno Corporativo' : 'Governance';

  return createMetadata({
    title: `${teamMember.name} - ${governanceTitle}`,
    description: `${teamMember.title} at Todd Agriscience. ${teamMember.bio[0]}`,
    path: `/${locale}/investors/governance/${memberSlug}`,
    ogImage: `${env.baseUrl}/og-image.jpg`,
  });
}

/**
 * Dynamic governance page that loads team member content based on the slug
 * @param {GovernancePageProps} props - The page props
 * @returns {JSX.Element} - The governance page
 */
export default function GovernancePage({ params }: GovernancePageProps) {
  const { slug } = params;
  const memberSlug = slug[0];

  // Get the team member data
  const teamMember = (governanceTeam as Record<string, TeamMember>)[memberSlug];

  if (!teamMember) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <PageHero
        title={teamMember.name}
        subtitle={teamMember.title}
        showArrow={false}
      />

      {/* Content Section */}
      <ScrollShrinkWrapper>
        <div className="w-full rounded-2xl flex flex-col bg-secondary h-fit px-8 lg:px-16 py-16 lg:py-24">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <TeamMemberCard teamMember={teamMember} />
          </div>
        </div>
      </ScrollShrinkWrapper>
    </>
  );
}
