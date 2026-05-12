// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import { HamburgerButtonProps } from './types';

/**
 * Animated hamburger button used to toggle the mobile menu sheet.
 *
 * @param props - Open state, accessible label, and click handler.
 * @returns A 40×40 button rendering animated bars that morph into a close icon.
 */
export default function HamburgerButton({
  isOpen,
  label,
  onClick,
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={isOpen}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center"
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          'absolute h-[2px] w-6 bg-current transition-transform duration-300 ease-out',
          isOpen ? 'rotate-45' : '-translate-y-[5px]'
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'absolute h-[2px] w-6 bg-current transition-transform duration-300 ease-out',
          isOpen ? '-rotate-45' : 'translate-y-[5px]'
        )}
      />
    </button>
  );
}
