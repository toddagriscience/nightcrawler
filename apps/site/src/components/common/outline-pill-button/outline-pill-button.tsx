// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as React from 'react';

/** Shared outline pill styling for public calls to action. */
export const OUTLINE_PILL_BUTTON_CLASSNAME =
  'h-[42px] w-fit rounded-full border-[0.75px] border-[#848484] px-[20px] text-sm';

/** Button props with the public outline style fixed. */
export type OutlinePillButtonProps = Omit<ButtonProps, 'variant' | 'size'>;

/** Public outline pill; use asChild for a semantic link destination. */
export const OutlinePillButton = React.forwardRef<
  HTMLButtonElement,
  OutlinePillButtonProps
>(({ className, ...props }, ref) => (
  <Button
    {...props}
    ref={ref}
    variant="outline"
    className={cn(OUTLINE_PILL_BUTTON_CLASSNAME, className)}
  />
));
OutlinePillButton.displayName = 'OutlinePillButton';
