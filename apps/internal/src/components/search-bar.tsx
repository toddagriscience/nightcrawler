// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

/** Props for the SearchBar component */
interface SearchBarProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Callback when search is triggered (Enter or button click) */
  onSearch: (query: string) => void;
  /** Default value for the search input */
  defaultValue?: string;
}

/**
 * A search bar component that triggers search on Enter key press or button click.
 * @param props - SearchBar configuration
 */
export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  defaultValue = '',
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (inputRef.current) {
      onSearch(inputRef.current.value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-lg items-center gap-2">
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onKeyDown={handleKeyDown}
        aria-label="Search"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleSearch}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
