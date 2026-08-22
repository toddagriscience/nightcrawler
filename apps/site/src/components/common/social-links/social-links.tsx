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

/** A Todd social media platform rendered by {@link SocialLinks}. */
export type SocialPlatform =
  'x' | 'instagram' | 'linkedin' | 'youtube' | 'discord';

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
 * Canonical source of truth for Todd's social media profiles. Update a URL,
 * label, or icon here and every surface that renders {@link SocialLinks} stays
 * in sync, instead of each footer hardcoding its own copy.
 */
export const SOCIAL_LINKS: Record<SocialPlatform, SocialLink> = {
  x: {
    href: 'https://x.com/toddagriscience',
    label: 'Visit our X (Twitter) page',
    Icon: FaXTwitter,
  },
  instagram: {
    href: 'https://www.instagram.com/toddagriscience/',
    label: 'Visit our Instagram page',
    Icon: FaInstagram,
  },
  linkedin: {
    href: 'https://www.linkedin.com/company/toddagriscience/',
    label: 'Visit our LinkedIn page',
    Icon: FaLinkedinIn,
  },
  youtube: {
    href: 'https://www.youtube.com/@toddagriscience',
    label: 'Visit our YouTube channel',
    Icon: FaYoutube,
  },
  discord: {
    href: 'https://discord.gg/rFY3kc4deK',
    label: 'Join our Discord server',
    Icon: FaDiscord,
  },
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
