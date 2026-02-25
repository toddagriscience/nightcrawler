// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ManagementZoneSelect } from '@/lib/types/db';

export default function NewTabDropdown({
  addTab,
  children,
  managementZones,
}: {
  addTab: (arg0: number, arg1: string | null) => void;
  children: React.ReactNode;
  managementZones: ManagementZoneSelect[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        {managementZones.length > 0 ? (
          managementZones.map((zone, index) => (
            <div key={zone.id}>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => addTab(zone.id, zone.name)}
              >
                {zone.name || 'Untitled Zone'}
              </DropdownMenuItem>
              {index < managementZones.length - 1 && (
                <DropdownMenuSeparator className="mx-auto w-[95%]" />
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
