// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import {
  BiBody,
  BiChevronRight,
  BiSolidInfoCircle,
  BiSolidInfoSquare,
  BiSolidUserMinus,
} from 'react-icons/bi';

interface ContactLinkItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const contactLinkItems: ContactLinkItem[] = [
  {
    label: 'Training request',
    href: 'mailto:service.us@toddagriscience.com',
    icon: <BiBody className="size-5 text-[var(--foreground-muted)]" />,
  },
  {
    label: 'Recent Updates',
    href: '/en/news',
    icon: (
      <BiSolidInfoSquare className="size-5 text-[var(--foreground-muted)]" />
    ),
  },
  {
    label: 'Data Deletion Request',
    href: 'mailto:service.us@toddagriscience.com',
    icon: (
      <BiSolidUserMinus className="size-5 text-[var(--foreground-muted)]" />
    ),
  },
  {
    label: 'Disclosures',
    href: '/en/disclosures',
    icon: (
      <BiSolidInfoCircle className="size-5 text-[var(--foreground-muted)]" />
    ),
  },
];

/**
 * Support links section with quick access to common contact resources.
 * Clean, scannable list with warm styling.
 */
export default function ContactLinksSection() {
  return (
    <section className="mt-12 border-t border-[var(--border-subtle)] pt-8">
      <h2 className="text-xs font-medium uppercase tracking-widest text-[var(--foreground-muted)] mb-4">
        Quick Links
      </h2>
      <nav className="space-y-1">
        {contactLinkItems.map((item) => (
          <Link
            href={item.href}
            className="group flex w-full items-center min-h-[3.25rem] justify-between px-3 rounded-lg px-3 -mx-3 transition-colors duration-150 hover:bg-[var(--background-hover)]"
            key={item.label}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-[var(--foreground)] text-sm">
                {item.label}
              </span>
            </div>
            <BiChevronRight className="text-[var(--foreground-muted)] size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </nav>
    </section>
  );
}
