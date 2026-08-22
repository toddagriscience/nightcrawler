// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

/**
 * Root of a popover, owning the open state shared by the trigger and content.
 * @param {React.ComponentProps<typeof PopoverPrimitive.Root>} props - Radix popover root props
 * @returns {React.JSX.Element} The popover root
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * Control that toggles the popover. Pass `asChild` to use a custom element.
 * @param {React.ComponentProps<typeof PopoverPrimitive.Trigger>} props - Radix popover trigger props
 * @returns {React.JSX.Element} The popover trigger
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/**
 * Portalled, positioned panel holding the popover's contents.
 * @param {React.ComponentProps<typeof PopoverPrimitive.Content>} props - Radix popover content props
 * @param {string} [props.className] - Additional classes merged onto the panel
 * @param {PopoverPrimitive.PopoverContentProps['align']} [props.align] - Alignment against the trigger, defaults to `center`
 * @param {number} [props.sideOffset] - Distance in pixels from the trigger, defaults to `4`
 * @returns {React.JSX.Element} The popover content
 */
function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-none',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent };
