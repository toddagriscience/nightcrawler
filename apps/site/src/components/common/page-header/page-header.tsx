// Copyright © Todd Agriscience, Inc. All rights reserved.

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
  button?: React.ReactNode;
}) {
  const hasButton = button !== undefined;

  return (
    <div className="flex flex-col gap-4 justify-center items-center max-w-[910px] my-25 md:my-32">
      <span className="text-xs md:text-sm text-foreground">{caption}</span>
      <h1 className="text-[33px] md:text-5xl lg:text-[64px]">{title}</h1>
      <h3 className="text-base md:text[17px]/[28px]">{subtitle}</h3>
      {hasButton && (
        <div className="flex justify-center mt-5">
          <Button
            variant="outline"
            className="rounded-full border-[1px] border-[#848484] text-sm w-[168px] h-[47px]"
            size="lg"
          >
            {button}
          </Button>
        </div>
      )}
    </div>
  );
}
