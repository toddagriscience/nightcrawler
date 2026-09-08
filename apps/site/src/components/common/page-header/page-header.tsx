// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { isOutboundHref, toSafeHref } from '@/lib/sanity/safe-href';
import { cn } from '@/lib/utils';
import { Button } from '../../ui';

/**
 * Outline pill classes for {@link PageHeader} CTAs (also used by marketing pill links).
 */
export const PAGE_HEADER_BUTTON_CLASSNAME =
  'h-[44px] w-fit rounded-full border-[0.75px] border-[#848484] px-[20px] text-sm';

/**
 * PageHeader component for displaying a page header
 * @param caption - Optional eyebrow above the title
 * @param subtitle - Supporting copy under the title
 * @param title - The title of the page
 * @param button - Optional CTA under the subtitle
 * @param narrow - Inner-page width (`max-w-[610px]`). Default title block is 910px.
 * @param titleClassName - Optional title size/leading overrides
 * @param subtitleClassName - Optional subtitle width/size overrides
 * @param className - Optional root width overrides
 * @returns {JSX.Element} - The page header component
 */
export default function PageHeader({
  caption,
  subtitle,
  title,
  button,
  narrow = false,
  titleClassName,
  subtitleClassName,
  className,
}: {
  caption?: string;
  subtitle?: string;
  title: string;
  button?: {
    href: string;
    text: string;
    buttonClassName?: string;
  };
  narrow?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
}) {
  const buttonHref = button ? toSafeHref(button.href) : null;

  return (
    <div
      className={cn(
        'mx-auto my-25 flex w-full max-w-none flex-col items-center justify-center gap-6 text-center md:my-5',
        narrow ? 'md:max-w-[610px]' : 'md:max-w-[910px]',
        className
      )}
    >
      {caption ? (
        <span className="text-foreground text-sm">{caption}</span>
      ) : null}
      <h1
        className={cn(
          'w-[70%] sm:w-full max-w-none text-wrap text-[clamp(2rem,calc(2rem+2*((100vw-23.4375rem)/66.5625)),4rem)] leading-[clamp(2.28rem,calc(2.28rem+1.72*((100vw-23.4375rem)/66.5625)),4rem)] md:max-w-[910px] md:text-balance',
          titleClassName
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className={cn(
            'w-[80%] max-w-[37rem] text-[clamp(1rem,calc(1rem+0.0625*((100vw-23.4375rem)/66.5625)),1.0625rem)] leading-[1.65] whitespace-pre-line',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      ) : null}
      {button && buttonHref ? (
        <div className="mt-0.5 flex justify-center">
          <Button
            asChild
            variant="outline"
            className={cn(PAGE_HEADER_BUTTON_CLASSNAME, button.buttonClassName)}
          >
            {isOutboundHref(buttonHref) ? (
              <a href={buttonHref} rel="noopener noreferrer" target="_blank">
                {button.text}
              </a>
            ) : (
              <Link href={buttonHref}>{button.text}</Link>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
