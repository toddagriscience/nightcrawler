// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { FadeIn } from '@/components/common';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useState } from 'react';
import { PublicInquiryOption } from './types';

/**
 * Public Inquiry modal. Allows users to navigate to the support page or password reset page.
 *
 * @param {React.ReactNode} trigger - The element that opens the modal. Optional, defaults to a button.
 * @returns {JSX.Element} - The Public Inquiry modal with related logic.
 */
export default function PublicInquiryModal({
  trigger = undefined,
}: {
  trigger?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options: PublicInquiryOption[] = [
    { label: 'Forgot Email', href: '/support' },
    { label: 'Forgot Password', href: '/forgot-password' },
    { label: 'Contact Support', href: '/support' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          <Button
            type="button"
            className="m-0 h-min w-auto !justify-start p-0 font-medium hover:cursor-pointer hover:no-underline"
          >
            {trigger}
          </Button>
        ) : (
          <Button
            type="button"
            variant={'outline'}
            className="hover:cursor-pointer"
          >
            Help
          </Button>
        )}
      </DialogTrigger>
      <FadeIn>
        <DialogContent className="gap-8 sm:max-w-[430px]">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-xl leading-tight font-normal">
              What can we help with?
            </DialogTitle>
          </DialogHeader>
          <div className="divide-y divide-[#2A2727]/60 border-b border-[#2A2727]/60">
            {options.map((option) => (
              <Link
                key={option.label}
                href={option.href}
                className="text-foreground focus-visible:outline-primary flex w-full items-center justify-between px-4 py-4 text-left text-base font-normal transition hover:bg-[var(--background-secondary)]/30 hover:transition-all hover:duration-300 hover:ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
              >
                {option.label}
              </Link>
            ))}
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              className="w-full hover:cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:transition-all hover:duration-300 hover:ease-in-out focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              CANCEL
            </Button>
          </DialogFooter>
        </DialogContent>
      </FadeIn>
    </Dialog>
  );
}
