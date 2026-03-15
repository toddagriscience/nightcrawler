// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import type { ButtonProps } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { BiPlus } from 'react-icons/bi';

/** Displays the new-tab trigger and replaces the plus icon with a spinner while a tab creation request is pending. */
const NewTabButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { pending: boolean }
>(({ pending, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      aria-label={pending ? 'Creating a new tab' : 'Open new tab menu'}
      aria-busy={pending}
      disabled={pending}
      className={cn(
        'ml-3 h-fit w-fit cursor-pointer rounded-sm border-none p-0.5 leading-none hover:bg-[#D9D9D9]/32 hover:shadow-sm focus-visible:ring-0! focus-visible:ring-offset-0! [&_svg]:size-[22px]',
        className
      )}
      {...props}
    >
      {pending ? (
        <Spinner className="text-[#A09C9D] size-[22px]" />
      ) : (
        <BiPlus className="text-[#A09C9D]" />
      )}
    </Button>
  );
});

NewTabButton.displayName = 'NewTabButton';

export default NewTabButton;
