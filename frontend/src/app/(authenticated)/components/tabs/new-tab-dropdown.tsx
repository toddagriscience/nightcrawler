// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
      <DropdownMenuContent>
        {managementZones.length > 0 ? (
          managementZones.map((zone) => (
            <DropdownMenuItem
              key={zone.id}
              onClick={() => addTab(zone.id, zone.name)}
            >
              {zone.name || 'Untitled Zone'}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuLabel>No management zones</DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
