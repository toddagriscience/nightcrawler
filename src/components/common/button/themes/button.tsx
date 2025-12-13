// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cva } from 'class-variance-authority';

/**
 * Variants for the Button component
 * @param {string} variant - The variant of the button (default, outline, outlineLight)
 * @param {string} size - The size of the button (sm, md, lg)
 */
export const buttonVariants = cva(
  'inline-flex items-center gap-2 rounded-full transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-[#2A2727] text-[#FDFDFB] hover:bg-[#2A2727]/80',
        outline:
          'border border-[#2A2727] text-[#2A2727] hover:bg-[#2A2727] hover:text-[#FDFDFB]',
        outlineLight:
          'border border-[#FDFDFB] text-[#FDFDFB] hover:bg-[#FDFDFB] hover:text-[#2A2727]',
      },
      size: {
        sm: 'text-sm md:text-base px-3 py-1',
        md: 'text-base md:text-lg px-4 py-2',
        lg: 'text-lg md:text-xl lg:text-2xl px-5 py-2',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'lg',
    },
  }
);
