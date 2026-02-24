// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ReactNode } from 'react';

interface AccountInfoProps {
  title: string;
  description?: string;
  children: ReactNode;
}

interface AccountInfoSectionProps {
  title: string;
  children: ReactNode;
}

type AccountInfoStatusTone = 'success' | 'warning';

interface AccountInfoRowProps {
  label: string;
  value?: string;
  status?: string;
  statusTone?: AccountInfoStatusTone;
  rightContent?: ReactNode;
  valueClassName?: string;
}

const statusStyles: Record<AccountInfoStatusTone, string> = {
  success: 'text-[#00bc1d]',
  warning: 'text-[#ff4d00]',
};

export default function AccountInfo({
  title,
  description,
  children,
}: AccountInfoProps) {
  return (
    <section className="w-full max-w-[760px]">
      <h2 className="text-foreground text-[42px] leading-none font-[400]">
        {title}
      </h2>
      {description ? (
        <p className="text-foreground mt-4 text-[16px] leading-tight font-[300]">
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
}: AccountInfoSectionProps) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="text-foreground text-[18px] leading-none font-[400]">
        {title}
      </h3>
      <div className="border-black/20 mt-4 border-t">{children}</div>
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
}: AccountInfoRowProps) {
  const renderedRightContent = rightContent ?? (
    <>
      {value ? (
        <span className={valueClassName ?? 'text-[#808080]'}>{value}</span>
      ) : null}
      {status && statusTone ? (
        <span className={statusStyles[statusTone]}>{status}</span>
      ) : null}
    </>
  );

  return (
    <div className="border-black/20 flex min-h-12 items-center justify-between gap-4 border-b py-1">
      <span className="text-foreground text-[16px] leading-tight font-[400]">
        {label}
      </span>
      <div className="flex items-center gap-1.5 text-[16px] leading-tight font-[300]">
        {renderedRightContent}
      </div>
    </div>
  );
}
