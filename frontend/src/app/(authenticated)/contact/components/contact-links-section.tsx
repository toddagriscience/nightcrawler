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
    icon: <BiBody />,
  },
  {
    label: 'Recent Updated',
    href: '/news',
    icon: <BiSolidInfoSquare />,
  },
  {
    label: 'Data Deletion Request',
    href: '/privacy',
    icon: <BiSolidUserMinus />,
  },
  {
    label: 'Disclosures',
    href: '/disclosures',
    icon: <BiSolidInfoCircle />,
  },
];

export default function ContactLinksSection() {
  return (
    <section className="mt-12 border-t border-black/20">
      {contactLinkItems.map((item) => (
        <Link
          href={item.href}
          className="group flex w-full items-center justify-between border-b border-black/20 px-2 py-4 transition-opacity hover:opacity-70"
          key={item.label}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="text-foreground text-lg leading-none font-[400]">
              {item.label}
            </span>
          </div>
          <BiChevronRight className="text-foreground h-7 w-7" />
        </Link>
      ))}
    </section>
  );
}
