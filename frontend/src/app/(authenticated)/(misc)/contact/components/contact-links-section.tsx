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
    icon: <BiBody className="size-6" />,
  },
  {
    label: 'Recent Updates',
    href: '/en/news',
    icon: <BiSolidInfoSquare className="size-6" />,
  },
  {
    label: 'Data Deletion Request',
    href: 'mailto:service.us@toddagriscience.com',
    icon: <BiSolidUserMinus className="size-6" />,
  },
  {
    label: 'Disclosures',
    href: '/en/disclosures',
    icon: <BiSolidInfoCircle className="size-6" />,
  },
];

export default function ContactLinksSection() {
  return (
    <section className="mt-10 border-t border-[#D9D9D9]">
      {contactLinkItems.map((item) => (
        <Link
          href={item.href}
          className="group flex w-full items-center min-h-11 justify-between border-b border-[#D9D9D9] px-0.5 py-2 transition-opacity hover:opacity-70"
          key={item.label}
        >
          <div className="flex items-center gap-2">
            {item.icon}
            <span className="text-foreground text-sm font-thin">
              {item.label}
            </span>
          </div>
          <BiChevronRight className="text-foreground size-6" />
        </Link>
      ))}
    </section>
  );
}
