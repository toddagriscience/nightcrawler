// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { SearchBar } from '@/components/search-bar';

/** Props for the PageHeader component */
interface PageHeaderProps {
  /** Title of the page */
  title: string;
  /** Description of the page */
  description?: string;
  /** Callback when search is triggered */
  onSearch: (query: string) => void;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
}

/**
 * Shared page header with title, description, and search bar.
 * @param props - Page header configuration
 */
export function PageHeader({
  title,
  description,
  onSearch,
  searchPlaceholder,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <SearchBar placeholder={searchPlaceholder} onSearch={onSearch} />
    </div>
  );
}
