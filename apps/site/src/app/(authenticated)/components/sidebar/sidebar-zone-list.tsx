// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import type { SidebarManagementZone } from '@/app/(authenticated)/(no-sidebar)/account/db';
import { usePathname, useSearchParams } from 'next/navigation';
import ZoneItem from './zone-item';
import ZoneKeyboardNav from './zone-keyboard-nav';

interface SidebarZoneListProps {
  zones: Pick<SidebarManagementZone, 'id' | 'name' | 'isPending'>[];
  /** Oldest zone, matching the dashboard fallback instead of sidebar order. */
  defaultZoneId?: number;
}

/**
 * Sidebar zones with the current dashboard selection and keyboard shortcuts.
 * Invalid or repeated zone parameters fall back to the dashboard's default.
 *
 * @param props - Alphabetical sidebar zones and the default dashboard zone
 */
export default function SidebarZoneList({
  zones,
  defaultZoneId,
}: SidebarZoneListProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const zoneParams = searchParams.getAll('zone');
  const zoneParam = zoneParams.length === 1 ? zoneParams[0] : undefined;
  const activeZoneId =
    pathname === '/'
      ? (zones.find((zone) => String(zone.id) === zoneParam)?.id ??
        defaultZoneId)
      : undefined;

  return (
    <>
      <ZoneKeyboardNav zoneIds={zones.map((zone) => zone.id)} />
      {zones.map((zone, index) => (
        <ZoneItem
          key={zone.id}
          id={zone.id}
          name={zone.name ?? ''}
          index={index}
          isPending={zone.isPending}
          isActive={zone.id === activeZoneId}
        />
      ))}
    </>
  );
}
