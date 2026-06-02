// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/config';
import { Button } from '../../ui';
/**
 * PageHeader component for displaying a page header
 * @param subtitle - The subtitle of the page
 * @param title - The title of the page
 * @returns {JSX.Element} - The page header component
 */
export default function PageHeader({
  caption,
  subtitle,
  title,
  button,
}: {
  caption?: string;
  subtitle?: string;
  title: string;
  button?: {
    href: string;
    text: string;
    buttonClassName?: string;
  };
}) {
  const hasButton = button !== undefined;

  return (
    <div className="flex flex-col gap-6.25 justify-center items-center max-w-[910px] my-25 md:my-32 text-center">
      <span className="text-xs md:text-sm text-foreground">{caption}</span>
      <h1 className="text-[33px] md:text-5xl lg:text-[64px]">{title}</h1>
      <h3 className="text-base md:text[17px]/[28px] w-[80%] sm:w-full">
        {subtitle}
      </h3>
      {hasButton && (
        <div className="flex justify-center mt-5">
          <Button
            asChild
            variant="outline"
            className={cn(
              'rounded-full border-[0.75px] border-[#848484] text-sm w-[168px] h-[47px]',
              button.buttonClassName
            )}
            size="lg"
          >
            <Link href={button.href}>{button.text}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
