// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import ContactLinksSection from './components/contact-links-section';

export default function ContactPage() {
  return (
    <main className="mx-auto w-full">
      <div className="border-b border-[#D9D9D9]">
        <div className="flex w-full max-w-[1300px] items-center gap-22 px-8 mt-10 mb-10">
          <Link
            href="/"
            className="text-foreground inline-flex items-center gap-2 mt-[-4px]"
          >
            <BiArrowBack className="size-4" />
            <span className="text-lg leading-none font-normal text-foreground text-lg tracking-tight">
              Home
            </span>
          </Link>
          <h1 className="text-foreground text-4xl leading-none font-light">
            Support Tools
          </h1>
        </div>
      </div>

      <section className="mx-49 mt-10 w-[50%] max-w-[750px]">
        <div className="mt-12 flex flex-wrap gap-5">
          <Button
            asChild
            variant="brand"
            className="h-11 w-[144px] rounded-full"
          >
            <a href="mailto:service.us@toddagriscience.com">
              <Mail />
              Email
            </a>
          </Button>

          <Button
            asChild
            variant="brand"
            className="h-11 w-[144px] rounded-full"
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
