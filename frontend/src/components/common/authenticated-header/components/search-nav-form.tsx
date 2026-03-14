// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchNavForm() {
  return (
    <form
      action="/search"
      method="GET"
      className="flex w-full max-w-sm items-center"
      role="search"
      aria-label="Search knowledge base"
    >
      <label htmlFor="header-search" className="sr-only">
        Search knowledge base
      </label>
      <div className="relative min-w-0 flex-1">
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 left-1 h-6 w-6 -translate-y-1/2 rounded-full hover:bg-transparent"
          aria-label="Search"
        >
          <Search className="size-4" />
        </Button>
        <Input
          id="header-search"
          name="q"
          type="search"
          placeholder="Search"
          className="h-7.5 min-w-0 flex-1 pl-10"
        />
      </div>
    </form>
  );
}
