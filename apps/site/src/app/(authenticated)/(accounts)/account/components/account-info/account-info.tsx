// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';

type AccountInfoStatusTone = 'success' | 'warning';

const statusStyles: Record<AccountInfoStatusTone, string> = {
  success: 'text-[var(--zone-active)]',
  warning: 'text-[var(--zone-inactive)]',
};

/**
 * Main container wrapper for account info pages.
 * Provides consistent max-width, title hierarchy, and content spacing.
 */
export default function AccountInfo({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="w-full max-w-[640px]">
      <header className="border-b border-[var(--border-subtle)] pb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm text-[var(--foreground-muted)] leading-relaxed">
            {description}
          </p>
        ) : null}
      </header>
      <div className="pt-6">{children}</div>
    </section>
  );
}

/**
 * Section grouping within account info.
 * Creates a titled group with a subtle left accent and divider line.
 */
export function AccountInfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 first:mt-0">
      <h3 className="text-xs font-medium uppercase tracking-widest text-[var(--foreground-muted)] mb-3">
        {title}
      </h3>
      <div className="border-l-2 border-[var(--border-strong)] pl-4">
        <div className="border-t border-[var(--border-subtle)]">{children}</div>
      </div>
    </div>
  );
}

const rowStyles = cva(
  'flex min-h-[3rem] items-center justify-between gap-6 border-b border-[var(--border-subtle)] py-3 transition-colors duration-150',
  {
    variants: {
      interactive: {
        true: 'cursor-pointer hover:bg-[var(--background-hover)] -mx-4 px-4',
        false: '',
      },
    },
    defaultVariants: {
      interactive: false,
    },
  }
);

/**
 * Row displaying a label-value pair within a section.
 * Can be static or interactive (clickable link) with appropriate hover states.
 * Supports isEmpty prop to render a graceful empty state marker.
 */
export function AccountInfoRow({
  label,
  value,
  status,
  statusTone,
  rightContent,
  valueClassName,
  isEmpty,
  href,
}: {
  label: string;
  value?: string | ReactNode;
  status?: string;
  statusTone?: AccountInfoStatusTone;
  rightContent?: ReactNode;
  valueClassName?: string;
  isEmpty?: boolean;
  href?: string;
}) {
  const renderedRightContent = rightContent ?? (
    <>
      {isEmpty ? (
        <span
          aria-hidden="true"
          className="text-sm text-[var(--foreground-muted)] italic opacity-50"
        >
          —
        </span>
      ) : value ? (
        <span className={valueClassName ?? 'text-sm text-[var(--foreground)]'}>
          {value}
        </span>
      ) : null}
      {status && statusTone ? (
        <span className={`text-sm ${statusStyles[statusTone]}`}>{status}</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={rowStyles({ interactive: true })}>
        <span className="text-sm text-[var(--foreground-muted)] shrink-0">
          {label}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--foreground-secondary)] text-right">
            {renderedRightContent}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className={rowStyles({ interactive: false })}>
      <span className="text-sm text-[var(--foreground-muted)] shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--foreground-secondary)] text-right">
          {renderedRightContent}
        </span>
      </div>
    </div>
  );
}
