// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';

interface SidebarSheetProps {
  children: ReactNode;
}

export function SidebarSheet({ children }: SidebarSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="m-2"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-[280px] border-r border-[var(--border)]"
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
