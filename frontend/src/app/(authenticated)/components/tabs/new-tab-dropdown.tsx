// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ManagementZoneSelect } from '@/lib/types/db';

export default function NewTabDropdown({
  addTab,
  children,
  managementZones,
}: {
  addTab: (managementZoneId: number) => void;
  children: React.ReactNode;
  managementZones: ManagementZoneSelect[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gradient-to-b from-[#ffffff] to-[#eaeaea]/90">
        <DropdownMenuLabel className="text-foreground/80 font-normal">
          Add a new tab
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-auto w-[90%] bg-foreground/30" />
        {managementZones.length > 0 ? (
          managementZones.map((zone, index) => (
            <div key={zone.id}>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => addTab(zone.id)}
              >
                {zone.name || 'Untitled Zone'}
              </DropdownMenuItem>
              {index < managementZones.length - 1 && (
                <DropdownMenuSeparator className="mx-auto w-[90%] bg-foreground/30" />
              )}
            </div>
          ))
        ) : (
          <DropdownMenuLabel className="font-normal">
            No management zones
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
