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
import { useTransition } from 'react';
import NewTabButton from './components/new-tab-button';

/** Presents the management zone menu used to create tabs and shows a loading state on the trigger while creation is pending. */
export default function NewTabDropdown({
  addTab,
  managementZones,
}: {
  addTab: (managementZoneId: number) => Promise<void>;
  managementZones: ManagementZoneSelect[];
}) {
  const [pending, startTransition] = useTransition();

  function handleAddTab(managementZoneId: number) {
    startTransition(async () => {
      await addTab(managementZoneId);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NewTabButton pending={pending} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-1 border-[#D9D9D9] w-55 translate-x-[98px]">
        {managementZones.length > 0 ? (
          managementZones.map((zone, index) => (
            <div key={zone.id}>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                disabled={pending}
                onClick={() => handleAddTab(zone.id)}
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
