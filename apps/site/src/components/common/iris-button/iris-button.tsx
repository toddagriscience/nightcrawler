// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const irisButtonVariants = cva(
  'inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-normal tracking-wide whitespace-nowrap transition-[background-color,color] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[#181818] text-white hover:bg-[#181818]/90',
        outline: 'border border-[#d8d8d8] bg-white hover:bg-[#d9d9d9]/15',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

/**
 * Props for {@link IrisButton}.
 */
export interface IrisButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof irisButtonVariants> {}

/**
 * Iris platform button.
 *
 * `primary` is the dark fill. On hover the fill eases to 90% opacity.
 * `outline` is the light bordered button. On hover its background becomes
 * `#d9d9d9`. `destructive` is the red fill used for irreversible actions.
 *
 * @param props.variant - `primary` (default), `outline`, or `destructive`
 * @param props.className - Extra classes merged onto the button
 * @param props.children - Button label, and optional icon
 * @returns The button element
 *
 * @example
 * ```tsx
 * <IrisButton>Save</IrisButton>
 * <IrisButton variant="outline">Cancel</IrisButton>
 * ```
 */
const IrisButton = React.forwardRef<HTMLButtonElement, IrisButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(irisButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
IrisButton.displayName = 'IrisButton';

export { IrisButton };
