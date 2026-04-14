// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * PageHeader component for displaying a page header
 * @param subtitle - The subtitle of the page
 * @param title - The title of the page
 * @returns {JSX.Element} - The page header component
 */
export default function PageHeader({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center max-w-[910px] my-25 md:my-32">
      <span className="text-xs md:text-sm text-foreground">{subtitle}</span>
      <h1 className="text-[33px] md:text-5xl lg:text-[64px]">{title}</h1>
    </div>
  );
}
