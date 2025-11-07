// Copyright Todd Agriscience, Inc. All rights reserved.

import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '../themes/button';

/**
 * Props for the Button component
 * @param {string} href - The href of the button
 * @param {string} text - The text of the button
 * @param {string} className - The class name of the button
 * @param {boolean} showArrow - Whether the button should show an arrow
 * @param {boolean} isDark - Whether the button is dark
 */
export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  href?: string;
  text?: string;
  className?: string;
  showArrow?: boolean;
  isDark?: boolean;
}
