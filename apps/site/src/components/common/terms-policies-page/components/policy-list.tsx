// Copyright © Todd Agriscience, Inc. All rights reserved.

import { cn } from '@/lib/utils';
import type { PolicyListProps } from '../types';

/**
 * Bulleted or numbered list sharing the policy prose type scale.
 *
 * @param {PolicyListProps} props - List entries, ordered flag, and optional extra classes
 * @returns {JSX.Element} - The list
 */
export default function PolicyList({
  items,
  ordered = false,
  className,
}: PolicyListProps) {
  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <ListTag
      className={cn(
        ordered ? 'list-decimal' : 'list-disc',
        'space-y-1 pl-6 text-[13px] leading-relaxed font-normal',
        className
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="text-[13px]">
          {item}
        </li>
      ))}
    </ListTag>
  );
}
