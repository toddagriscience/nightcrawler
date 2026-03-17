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
import Link from 'next/link';

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
      <DropdownMenuContent className="bg-white border-1 border-[#D9D9D9] w-55 translate-x-[98px]">
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
                <DropdownMenuSeparator className="mx-auto w-[90%] bg-[#D9D9D9]" />
              )}
            </div>
          ))
        ) : (
          <DropdownMenuLabel className="font-normal">
            No management zones
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator className="bg-[#D9D9D9]" />
        <DropdownMenuLabel className="text-foreground/90 font-normal text-center">
          <Link
            href="/account/management-zones"
            className="hover:cursor-pointer"
          >
            Edit Management Zones
          </Link>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
