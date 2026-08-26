// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Link } from '@/i18n/config';
import { cn } from '@/lib/utils';
import React from 'react';
import { HiArrowLongRight } from 'react-icons/hi2';
import { buttonVariants } from './themes/button';
import { ButtonProps } from './types/button';

/**
 * Basic button component
 * @param {string} props.href - The href of the button (optional)
 * @param {string} props.text - The text of the button
 * @param {string} props.className - The class name of the button (optional)
 * @param {boolean} props.showArrow - Whether the button should show an arrow (optional)
 * @param {string} props.variant - The variant of the button (optional)
 * @param {string} props.size - The size of the button (optional)
 * @param {boolean} props.isDark - Whether the button is dark (optional)
 * @param {Function} props.onClick - Action to run on click (optional). When
 * given, the button renders as a `button` element instead of a link
 * @returns {React.FC<ButtonProps>} The button component
 * @example
 *
 * ```tsx
 * <Button href="/" text="Click me" showArrow={true} variant="default" size="lg" isDark={true} />
 * <Button text="Log out" showArrow={false} onClick={() => logout()} />
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
  onClick,
}) => {
  // Determine which variant to use based on dark mode
  const effectiveVariant = isDark ? 'outlineLight' : variant || 'outline';

  const combinedClasses = cn(
    buttonVariants({
      variant: effectiveVariant,
      size,
      className,
    }),
    'flex items-center justify-center gap-2'
  );

  const content = (
    <>
      {text}
      {showArrow && <HiArrowLongRight className="size-8" />}
    </>
  );

  // Actions such as logging out have no destination, so they render a real
  // button while keeping the shared styling.
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(combinedClasses, 'cursor-pointer')}
        data-testid="button-component"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href || ''}
      className={combinedClasses}
      data-testid="button-component"
    >
      {content}
    </Link>
  );
};

export default Button;
