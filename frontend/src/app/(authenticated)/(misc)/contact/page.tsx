// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import ContactLinksSection from './components/contact-links-section';

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 pb-12">
      <div className="mt-2">
        <Link
          href="/"
          className="text-foreground inline-flex items-center gap-2 leading-none font-normal hover:opacity-70"
        >
          <p aria-hidden="true" className="flex flex-row items-center text-xl">
            ←
          </p>
          <p className="text-xl">Back</p>
        </Link>
      </div>

      <section className="mx-auto mt-20 w-full max-w-[760px]">
        <h1 className="text-foreground text-[48px] leading-none font-normal">
          Talk to us
        </h1>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            asChild
            variant="brand"
            className="min-w-45 rounded-full px-8 py-3 text-lg font-normal"
          >
            <a href="mailto:service.us@toddagriscience.com">
              <Mail />
              Email
            </a>
          </Button>

          <Button
            asChild
            variant="brand"
            className="min-w-45 rounded-full px-8 py-3 text-lg font-normal"
          >
            <a href="tel:+18882791283">
              <MessageCircle />
              SMS Text
            </a>
          </Button>
        </div>

        <ContactLinksSection />
      </section>
    </main>
  );
}
