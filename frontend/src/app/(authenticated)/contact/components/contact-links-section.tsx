// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import {
  BiBody,
  BiChevronRight,
  BiSolidInfoCircle,
  BiSolidInfoSquare,
  BiSolidUserMinus,
} from 'react-icons/bi';
import { IconType } from 'react-icons';

interface ContactLinkItem {
  label: string;
  href: string;
  icon: IconType;
}

const contactLinkItems: ContactLinkItem[] = [
  {
    label: 'Training request',
    href: 'mailto:service.us@toddagriscience.com',
    icon: BiBody,
  },
  {
    label: 'Recent Updated',
    href: '/news',
    icon: BiSolidInfoSquare,
  },
  {
    label: 'Data Deletion Request',
    href: '/privacy',
    icon: BiSolidUserMinus,
  },
  {
    label: 'Disclosures',
    href: '/disclosures',
    icon: BiSolidInfoCircle,
  },
];

function ContactLinkRow({ item }: { item: ContactLinkItem }) {
  const rowClassName =
    'group flex w-full items-center justify-between border-b border-black/20 px-2 py-4 transition-opacity hover:opacity-70';
  const Icon = item.icon;
  const isExternal = item.href.startsWith('mailto:');

  const content = (
    <>
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-foreground" />
        <span className="text-foreground text-[28px] leading-none font-[400]">
          {item.label}
        </span>
      </div>
      <BiChevronRight className="h-7 w-7 text-foreground" />
    </>
  );

  if (isExternal) {
    return (
      <a href={item.href} className={rowClassName}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={rowClassName}>
      {content}
    </Link>
  );
}

export default function ContactLinksSection() {
  return (
    <section className="mt-12 border-t border-black/20">
      {contactLinkItems.map((item) => (
        <ContactLinkRow item={item} key={item.label} />
      ))}
    </section>
  );
}
