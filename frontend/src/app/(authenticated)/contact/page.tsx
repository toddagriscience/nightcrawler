// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { BiSolidComment } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import ContactLinksSection from './components/contact-links-section';

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 pb-12">
      <div className="mt-2">
        <Link
          href="/"
          className="text-foreground inline-flex items-center gap-2 text-[36px] leading-none font-[400] hover:opacity-70"
        >
          <span aria-hidden="true">←</span>
          <span className="text-[32px]">Back</span>
        </Link>
      </div>

      <section className="mx-auto mt-20 w-full max-w-[760px]">
        <h1 className="text-foreground text-[48px] leading-none font-[400]">
          Support tools
        </h1>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            asChild
            variant="brand"
            className="h-14 min-w-[220px] rounded-full text-[22px] font-[400]"
          >
            <a href="mailto:service.us@toddagriscience.com">
              <BiSolidComment className="h-5 w-5" />
              Email
            </a>
          </Button>

          <Button
            asChild
            variant="brand"
            className="h-14 min-w-[220px] rounded-full text-[22px] font-[400]"
          >
            <a href="text:8882791283">
              <BiSolidComment className="h-5 w-5" />
              SMS Text
            </a>
          </Button>
        </div>

        <ContactLinksSection />
      </section>
    </main>
  );
}
