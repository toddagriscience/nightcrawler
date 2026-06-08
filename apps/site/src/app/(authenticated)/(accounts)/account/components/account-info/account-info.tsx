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
      <header className="mb-8">
        <h2 className="text-3xl font-light tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm text-[var(--foreground-muted)] leading-relaxed">
            {description}
          </p>
        ) : null}
      </header>
      <div className="space-y-0">{children}</div>
    </section>
  );
}

/**
 * Section grouping within account info.
 * Creates a titled group with a subtle left accent line.
 */
export function AccountInfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-8 first:pt-0">
      <div className="flex items-center gap-4 mb-5">
        <h3 className="text-xs font-medium uppercase tracking-widest text-[var(--foreground-muted)] shrink-0">
          {title}
        </h3>
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      </div>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

const rowStyles = cva(
  'flex min-h-[3rem] items-center justify-between gap-6 py-3 border-b border-[var(--border-subtle)]/60 transition-colors duration-150',
  {
    variants: {
      interactive: {
        true: 'cursor-pointer hover:bg-[var(--background-hover)] -mx-4 px-4 rounded',
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
          <svg
            className="w-4 h-4 text-[var(--foreground-muted)]/40 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
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
