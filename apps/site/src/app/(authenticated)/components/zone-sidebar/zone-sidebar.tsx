// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { cn } from '@/lib/utils';
import logger from '@/lib/logger';
import { ManagementZoneSelect } from '@/lib/types/db';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import updateTabName from '../tabs/actions';

/** Shared inner content for a zone row (green dot, name/rename input, shortcut badge). */
function ZoneItemContent({
  zone,
  index,
  isActive,
  canEdit,
  onRename,
}: {
  zone: ManagementZoneSelect;
  index: number;
  isActive: boolean;
  canEdit: boolean;
  onRename: (newName: string, oldName: string) => void;
}) {
  return (
    <>
      {/* Green dot indicator */}
      {zone.name ? (
        <span className="size-2 shrink-0 rounded-full bg-green-500" />
      ) : (
        <span className="size-2 shrink-0" />
      )}

      {/* Zone name - editable on active zone for admins */}
      {isActive && canEdit ? (
        <input
          className="min-w-0 flex-1 truncate bg-transparent text-sm focus:outline-none focus:ring-0"
          defaultValue={zone.name || 'Untitled Zone'}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            onRename(e.target.value, zone.name || 'Untitled Zone')
          }
          onBlur={(e) => {
            e.target.scrollLeft = 0;
          }}
        />
      ) : (
        <span className="min-w-0 flex-1 truncate">
          {zone.name || 'Untitled Zone'}
        </span>
      )}

      {/* Keyboard shortcut badge */}
      <kbd className="shrink-0 rounded bg-[#D9D9D9]/40 px-1.5 py-0.5 text-[10px] text-foreground/40">
        {index + 1}
      </kbd>
    </>
  );
}

/** Static (non-draggable) zone row used for SSR and the first client render. */
function StaticZoneItem({
  zone,
  index,
  isActive,
  canEdit,
  onSelect,
  onRename,
}: {
  zone: ManagementZoneSelect;
  index: number;
  isActive: boolean;
  canEdit: boolean;
  onSelect: (zoneId: number) => void;
  onRename: (newName: string, oldName: string) => void;
}) {
  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors',
        isActive
          ? 'text-foreground'
          : 'text-foreground/70 hover:text-foreground'
      )}
      onClick={() => onSelect(zone.id)}
      aria-current={isActive ? 'page' : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(zone.id);
        }
      }}
    >
      <ZoneItemContent
        zone={zone}
        index={index}
        isActive={isActive}
        canEdit={canEdit}
        onRename={onRename}
      />
    </div>
  );
}

/**
 * A single sortable zone item in the sidebar list.
 *
 * @param zone - The management zone data
 * @param index - The position index of this zone in the list
 * @param isActive - Whether this zone is currently selected
 * @param canEdit - Whether the user can rename zones
 * @param onSelect - Callback when the zone is clicked
 * @param onRename - Callback when the zone name is changed
 */
function SortableZoneItem({
  zone,
  index,
  isActive,
  canEdit,
  onSelect,
  onRename,
}: {
  zone: ManagementZoneSelect;
  index: number;
  isActive: boolean;
  canEdit: boolean;
  onSelect: (zoneId: number) => void;
  onRename: (newName: string, oldName: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: zone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors',
        isActive
          ? 'text-foreground'
          : 'text-foreground/70 hover:text-foreground',
        isDragging && 'opacity-50'
      )}
      onClick={() => onSelect(zone.id)}
      aria-current={isActive ? 'page' : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(zone.id);
        }
      }}
      {...attributes}
      {...listeners}
    >
      <ZoneItemContent
        zone={zone}
        index={index}
        isActive={isActive}
        canEdit={canEdit}
        onRename={onRename}
      />
    </div>
  );
}

/**
 * Left sidebar that lists all management zones for the farm.
 * Supports drag-to-reorder (persisted to localStorage) and inline renaming.
 *
 * @param managementZones - All management zones for the user's farm
 * @param canEdit - Whether the current user has Admin privileges
 * @param userId - The current user's ID (used as localStorage key)
 */
export default function ZoneSidebar({
  managementZones,
  canEdit,
  userId,
}: {
  managementZones: ManagementZoneSelect[];
  canEdit: boolean;
  userId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedZoneId = searchParams.get('zone');

  // Sort zones: use localStorage order if available, otherwise by createdAt asc
  // Deterministic order for SSR + first client render (no localStorage).
  const [orderedZones, setOrderedZones] = useState<ManagementZoneSelect[]>(() =>
    defaultOrder(managementZones)
  );

  // After hydration: enable dnd-kit and apply any saved localStorage order.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedZones(applySavedOrder(managementZones, userId));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [managementZones, userId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectZone = useCallback(
    (zoneId: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('zone', String(zoneId));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  async function handleRename(newName: string, oldName: string) {
    try {
      await updateTabName({ newName, oldName });
      router.refresh();
    } catch (error) {
      logger.error(error);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedZones((prev) => {
      const oldIndex = prev.findIndex((z) => z.id === active.id);
      const newIndex = prev.findIndex((z) => z.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);

      // Persist order to localStorage
      const orderIds = next.map((z) => z.id);
      try {
        localStorage.setItem(`zone-order-${userId}`, JSON.stringify(orderIds));
      } catch {
        // localStorage may be unavailable
      }

      return next;
    });
  }

  const zoneIds = useMemo(() => orderedZones.map((z) => z.id), [orderedZones]);

  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col border-r border-[#D9D9D9]/30 bg-background-platform"
      aria-label="Management zones"
    >
      <div className="px-3 pt-3 pb-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/50">
          Management Zones
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto px-1.5 pb-2">
        {!mounted ? (
          // SSR / pre-hydration: plain list, identical on server and client.
          orderedZones.map((zone, index) => (
            <StaticZoneItem
              key={zone.id}
              zone={zone}
              index={index}
              isActive={String(zone.id) === selectedZoneId}
              canEdit={canEdit}
              onSelect={selectZone}
              onRename={handleRename}
            />
          ))
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={zoneIds}
              strategy={verticalListSortingStrategy}
            >
              {orderedZones.map((zone, index) => (
                <SortableZoneItem
                  key={zone.id}
                  zone={zone}
                  index={index}
                  isActive={String(zone.id) === selectedZoneId}
                  canEdit={canEdit}
                  onSelect={selectZone}
                  onRename={handleRename}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </nav>
    </aside>
  );
}

/** Sorts zones by createdAt ascending (oldest first), the deterministic default. */
function defaultOrder(zones: ManagementZoneSelect[]): ManagementZoneSelect[] {
  return [...zones].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/** Applies saved localStorage order to the zone list, falling back to createdAt ascending. */
function applySavedOrder(
  zones: ManagementZoneSelect[],
  userId: string
): ManagementZoneSelect[] {
  try {
    const saved = localStorage.getItem(`zone-order-${userId}`);
    if (saved) {
      const orderIds: number[] = JSON.parse(saved);
      const zoneMap = new Map(zones.map((z) => [z.id, z]));
      const ordered: ManagementZoneSelect[] = [];

      // Add zones in saved order
      for (const id of orderIds) {
        const zone = zoneMap.get(id);
        if (zone) {
          ordered.push(zone);
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          zoneMap.delete(id);
        }
      }

      // Append any new zones not in saved order
      for (const zone of zoneMap.values()) {
        ordered.push(zone);
      }

      return ordered;
    }
  } catch {
    // localStorage unavailable or parse error
  }

  // Default: sort by createdAt ascending (oldest first)
  return defaultOrder(zones);
}
