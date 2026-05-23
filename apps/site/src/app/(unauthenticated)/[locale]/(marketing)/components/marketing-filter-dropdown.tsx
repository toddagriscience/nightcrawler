// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BiChevronDown } from 'react-icons/bi';
import { cn } from '@/lib/utils';

/** Matches careers index toolbar filters; avoids Radix Select layout shift. */
export const MARKETING_FILTER_TRIGGER_CLASS =
  'inline-flex h-auto w-full min-w-0 items-center justify-between gap-1 rounded-md border border-[#848484]/80 bg-background px-3 py-2 text-left text-sm font-normal text-foreground shadow-none outline-none focus-visible:ring-1 focus-visible:ring-offset-2';

/** One selectable option for {@link MarketingFilterDropdown}. */
export interface MarketingFilterDropdownOption {
  /** Stored value */
  value: string;
  /** Visible label */
  label: string;
}

/** Props for {@link MarketingFilterDropdown}. */
export interface MarketingFilterDropdownProps {
  /** Current value */
  value: string;
  /** Called when the user picks an option */
  onValueChange: (value: string) => void;
  /** Selectable options */
  options: MarketingFilterDropdownOption[];
  /** Shown when `value` is empty or matches `emptyValue` */
  placeholder: string;
  /** Accessible name for the trigger */
  ariaLabel: string;
  /** Optional sentinel value treated as “no selection” for placeholder display */
  emptyValue?: string;
  /** id for the trigger button */
  id?: string;
  /** Override trigger styling (e.g. careers toolbar filters) */
  triggerClassName?: string;
  /** When true, dropdown panel matches trigger width */
  matchTriggerWidth?: boolean;
}

/**
 * Dropdown filter control shared by careers index and CMS forms.
 *
 * @param props - Value, options, and labels
 */
export function MarketingFilterDropdown({
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  emptyValue = '',
  id,
  triggerClassName = MARKETING_FILTER_TRIGGER_CLASS,
  matchTriggerWidth = false,
}: MarketingFilterDropdownProps) {
  const triggerLabel =
    value === emptyValue || value.length === 0
      ? placeholder
      : (options.find((option) => option.value === value)?.label ?? value);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        type="button"
        id={id}
        className={triggerClassName}
        aria-label={ariaLabel}
      >
        <span className="truncate">{triggerLabel}</span>
        <BiChevronDown aria-hidden className="h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          'max-h-72 overflow-y-auto',
          matchTriggerWidth && 'w-[var(--radix-dropdown-menu-trigger-width)]'
        )}
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
