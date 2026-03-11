// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import type { ReactNode } from 'react';

type AccountInfoStatusTone = 'success' | 'warning';

const statusStyles: Record<AccountInfoStatusTone, string> = {
  success: 'text-[#00bc1d]',
  warning: 'text-[#ff4d00]',
};

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
    <section className="w-full max-w-[568px]">
      <h2 className="text-foreground text-3xl leading-none">{title}</h2>
      {description ? (
        <p className="text-foreground mt-6 text-sm font-light italic">
          {description}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function AccountInfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="text-foreground text-xl font-normal">{title}</h3>
      <div className="border-[#D9D9D9] mt-3 border-t px-0.5">{children}</div>
    </div>
  );
}

export function AccountInfoRow({
  label,
  value,
  status,
  statusTone,
  rightContent,
  valueClassName,
  href,
}: {
  label: string;
  value?: string | ReactNode;
  status?: string;
  statusTone?: AccountInfoStatusTone;
  rightContent?: ReactNode;
  valueClassName?: string;
  href?: string;
}) {
  const renderedRightContent = rightContent ?? (
    <>
      {value ? (
        <span
          className={
            valueClassName ?? 'text-sm font-normal text-muted-foreground mx-0.5'
          }
        >
          {value}
        </span>
      ) : null}
      {status && statusTone ? (
        <span
          className={`text-sm font-normal ${statusStyles[statusTone]} mx-0.5`}
        >
          {status}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="border-[#D9D9D9] flex min-h-11 items-center justify-between gap-4 border-b py-2 hover:opacity-70"
      >
        <span className="text-muted-foreground text-sm mx-0.5">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground/70 mx-0.5">
            {renderedRightContent}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="border-[#D9D9D9] flex min-h-11 items-center justify-between gap-4 border-b py-2">
      <span className="text-foreground text-sm mx-0.5">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-foreground/70 mx-0.5">
          {renderedRightContent}
        </span>
      </div>
    </div>
  );
}
