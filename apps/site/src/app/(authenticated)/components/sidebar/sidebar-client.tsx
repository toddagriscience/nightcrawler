// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import SidebarContent from './sidebar';

/**
 * Responsive sidebar wrapper that shows:
 * - Full sidebar panel on desktop (>= 768px)
 * - Sheet overlay with toggle button on mobile (< 768px)
 */
export default function SidebarClient() {
  return (
    <>
      {/* Desktop: always visible sidebar */}
      <div className="hidden md:flex w-[280px] shrink-0 flex-col h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile: sheet overlay */}
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="m-2" aria-label="Open navigation menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
