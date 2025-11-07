// Copyright Todd Agriscience, Inc. All rights reserved.

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine class names with Tailwind CSS class merging
 * Necessary for Shadcn UI compatibility with Tailwind CSS.
 * @param {ClassValue[]} inputs - Array of class values to merge
 * @returns {string} - Merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
