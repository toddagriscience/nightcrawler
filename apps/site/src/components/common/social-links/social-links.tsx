// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import type { IconType } from 'react-icons';
import {
  FaDiscord,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { SOCIAL_PROFILES, type SocialPlatform } from './social-profiles';

export type { SocialPlatform, SocialProfile } from './social-profiles';

/** A single entry of the shared {@link SOCIAL_LINKS} record. */
export interface SocialLink {
  /** Absolute URL of the Todd profile on this platform. */
  href: string;
  /** Accessible label for the link. */
  label: string;
  /** react-icons glyph for the platform. */
  Icon: IconType;
}

/**
 * Canonical source of truth for Todd's renderable social media profiles: the
 * URLs and labels from {@link SOCIAL_PROFILES} paired with their icons. Update
 * a URL or label in `social-profiles.ts` and every surface that renders
 * {@link SocialLinks} stays in sync, instead of each footer hardcoding its own
 * copy.
 */
export const SOCIAL_LINKS: Record<SocialPlatform, SocialLink> = {
  x: { ...SOCIAL_PROFILES.x, Icon: FaXTwitter },
  instagram: { ...SOCIAL_PROFILES.instagram, Icon: FaInstagram },
  linkedin: { ...SOCIAL_PROFILES.linkedin, Icon: FaLinkedinIn },
  youtube: { ...SOCIAL_PROFILES.youtube, Icon: FaYoutube },
  discord: { ...SOCIAL_PROFILES.discord, Icon: FaDiscord },
};

/** Default platforms and order rendered when no `platforms` prop is given. */
const DEFAULT_PLATFORMS: SocialPlatform[] = [
  'x',
  'instagram',
  'linkedin',
  'youtube',
  'discord',
];

/** Props for {@link SocialLinks}. */
export interface SocialLinksProps {
  /** Which platforms to render, in order. Defaults to every platform. */
  platforms?: SocialPlatform[];
  /** Pixel size passed to each icon. Defaults to the react-icons default (1em). */
  iconSize?: number;
  /**
   * Classes for the container element, merged over the default flex row. Pass
   * `contents` when the icons must participate directly in the parent's flex
   * layout instead of forming their own row.
   */
  className?: string;
  /**
   * Open each profile in a new tab. Defaults to `false` because an icon-only
   * link cannot warn about the new tab without changing its accessible name.
   */
  newTab?: boolean;
}

/**
 * Renders Todd's social media profiles as accessible icon links.
 *
 * URLs, labels, and icons come from the shared {@link SOCIAL_LINKS} record so
 * consuming surfaces (footers, the 404 page) never duplicate them. Layout is
 * owned by the caller through `className`, so the component can either form its
 * own row or dissolve into an existing one via `contents`.
 *
 * @param props - See {@link SocialLinksProps}
 */
export default function SocialLinks({
  platforms = DEFAULT_PLATFORMS,
  iconSize,
  className,
  newTab = false,
}: SocialLinksProps) {
  return (
    <div className={cn('flex flex-row flex-wrap gap-6', className)}>
      {platforms.map((platform) => {
        const { href, label, Icon } = SOCIAL_LINKS[platform];
        return (
          <a
            key={platform}
            href={href}
            aria-label={label}
            {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            <Icon aria-hidden="true" size={iconSize} />
          </a>
        );
      })}
    </div>
  );
}
