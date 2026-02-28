// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button } from '@/components/common';
import SanityBodyText from '@/components/sanity/governance-profile/sanity-body-text';
import SanityImage from '@/components/sanity/governance-profile/sanity-image';
import SanityQuote from '@/components/sanity/governance-profile/sanity-quote';
import sanityQuery from '@/lib/sanity/query';
import { urlFor } from '@/lib/sanity/utils';
import { PortableText, PortableTextReactComponents } from 'next-sanity';
import { notFound } from 'next/navigation';

/**
 * A governance profile page, rendered with Sanity CMS.
 *
 * @param {Promise<{ slug: string }>} params - The slug of the profile
 * @returns {JSX.Element} - The rendered governance profile*/
export default async function GovernancePage({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const { slug } = await params;
  const resolvedSlug = Array.isArray(slug) ? slug[0] : slug;
  const profile = await sanityQuery(
    'governance-profiles',
    { slug: resolvedSlug },
    { next: { revalidate: 0 } },
    0
  );

  if (!profile) {
    notFound();
  }
  /** Sanity helpers. See: https://github.com/portabletext/react-portabletext#customizing-components */
  const portableTextComponents: Partial<PortableTextReactComponents> = {
    block: {
      normal: (props) => <SanityBodyText {...props} />,
    },
  };
  const profileImageUrl = profile.profileImage
    ? urlFor(profile.profileImage)?.url()
    : undefined;
  const hasBackstory =
    Array.isArray(profile.backstory) && profile.backstory.length > 0;
  const hasVision = Array.isArray(profile.vision) && profile.vision.length > 0;
  const profileEmail =
    typeof profile.email === 'string' ? profile.email.trim() : '';
  const firstName =
    typeof profile.name === 'string'
      ? profile.name.trim().split(/\s+/)[0]
      : undefined;

  return (
    <div className="max-w-[80%] mx-auto">
      <main className="mt-20 container mx-auto min-h-screen flex flex-col gap-10 md:gap-4">
        {/* Article Header */}
        <div className="flex mb-10 md:mb-0 lg:mb-6 flex-col">
          <h2 className="text-4xl md:text-5xl lg:text-6xl w-full leading-tight text-center font-thin mb-6 lg:mb-8 mt-4 md:mt-8">
            {profile.name}
          </h2>
          <p className="md:mb-4 text-lg md:text-xl lg:text-2xl font-thin leading-relaxed text-center">
            {profile.title}
          </p>
        </div>
        <div className="flex mb-10 flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-center gap-12 md:gap-6 lg:gap-24 w-full lg:max-w-[1100px] mx-auto">
          {/* Profile Image */}
          <div className="flex flex-col mb-10 md:mb-0 lg:mb-10 w-full max-w-[420px] sm:w-full lg:max-w-[500px]">
            <SanityImage
              profileImage={profile.profileImage}
              src={profileImageUrl}
              alt={profile.profileImage?.alt ?? profile.name ?? ''}
              className="w-full"
            />
          </div>
          {/* Quote Block */}
          {profile.quote ? (
            <div className="flex w-full items-center justify-center text-normal md:text-base lg:text-base font-light leading-relaxed text-center lg:flex-1 lg:max-w-[520px]">
              <SanityQuote quote={profile.quote} />
            </div>
          ) : null}
        </div>
        <div className="flex lg:flex-row flex-col gap-16 lg:gap-10 max-w-[80%] md:max-w-[70%] lg:max-w-[1100px] mx-auto">
          {/* Backstory Block */}
          <div className="flex flex-col gap-2 lg:flex-1">
            {hasBackstory ? (
              <div className="flex flex-col gap-4">
                <h3 className="text-xs lg:text-sm w-full leading-tight font-thin uppercase">
                  Backstory
                </h3>
                <div className="flex flex-col gap-4">
                  <PortableText
                    value={profile.backstory}
                    components={portableTextComponents}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 lg:flex-1 mb-26 lg:mb-16">
            {/* Vision Block */}
            {hasVision ? (
              <div className="flex flex-col gap-4 mb-26 lg:mb-16">
                <h3 className="text-xs lg:text-sm w-full leading-tight font-thin uppercase">
                  Vision
                </h3>
                <div className="flex flex-col gap-4">
                  <PortableText
                    value={profile.vision}
                    components={portableTextComponents}
                  />
                </div>
              </div>
            ) : null}
            {/* Reach out button */}

            {profileEmail ? (
              <Button
                variant="outline"
                size="md"
                className="font-thin self-start"
                text={`Reach out to ${firstName ?? 'the team'}`}
                href={`mailto:${profileEmail}`}
              />
            ) : null}
          </div>
        </div>
        {/* Grey Line Block */}
        <div className="flex flex-row justify-center gap-2 items-center mb-30">
          <div className="w-full h-[1px] bg-gray-500/30" />
        </div>
      </main>
    </div>
  );
}
