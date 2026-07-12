// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { IconType } from 'react-icons';
import {
  FaDiscord,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { cn } from '@/lib/utils';

/** A Todd social media platform rendered by {@link SocialLinks}. */
export type SocialPlatform =
  | 'x'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'discord';

interface SocialLink {
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
  /** Additional classes for the container element. */
  className?: string;
}

/**
 * Renders Todd's social media profiles as accessible external icon links.
 *
 * URLs, labels, and icons come from the shared {@link SOCIAL_LINKS} record so
 * consuming surfaces (footers, etc.) never duplicate them. Links open in a new
 * tab with `rel="noopener noreferrer"`.
 *
 * @param props - See {@link SocialLinksProps}
 */
export default function SocialLinks({
  platforms = DEFAULT_PLATFORMS,
  iconSize,
  className,
}: SocialLinksProps) {
  return (
    <div className={cn('flex flex-row flex-wrap gap-6', className)}>
      {platforms.map((platform) => {
        const { href, label, Icon } = SOCIAL_LINKS[platform];
        return (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon aria-hidden="true" size={iconSize} />
          </a>
        );
      })}
    </div>
  );
}
