// Copyright (c) Todd Agriscience, Inc. All rights reserved.

'use client';

import React from 'react';
import { Link } from '@/i18n/config';
import { ArrowRight } from 'lucide-react';
import { ButtonProps } from './types/button';
import { buttonVariants } from './themes/button';

/**
 * Basic button component
 * @param {string} props.href - The href of the button (optional)
 * @param {string} props.text - The text of the button
 * @param {string} props.className - The class name of the button (optional)
 * @param {boolean} props.showArrow - Whether the button should show an arrow (optional)
 * @param {string} props.variant - The variant of the button (optional)
 * @param {string} props.size - The size of the button (optional)
 * @param {boolean} props.isDark - Whether the button is dark (optional)
 * @returns {React.FC<ButtonProps>} The button component
 * @example
 *
 * ```tsx
 * <Button href="/" text="Click me" showArrow={true} variant="default" size="lg" isDark={true} />
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  href,
  text,
  className = '',
  showArrow = true,
  variant,
  size,
  isDark = false,
}) => {
  // Determine which variant to use based on dark mode
  const effectiveVariant = isDark ? 'outlineLight' : variant || 'outline';

  const combinedClasses = buttonVariants({
    variant: effectiveVariant,
    size,
    className,
  });

  return (
    <Link
      href={href || ''}
      className={combinedClasses}
      data-testid="button-component"
    >
      {text}
      {showArrow && <ArrowRight className="text-2xl" />}
    </Link>
  );
};

export default Button;
