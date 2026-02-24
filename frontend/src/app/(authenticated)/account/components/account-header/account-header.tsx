// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AccountHeaderProps {
  farmName: string;
}

export default function AccountHeader({ farmName }: AccountHeaderProps) {
  const pathname = usePathname();
  const showBackLink = pathname.startsWith('/account/users');

  return (
    <div className="border-black/10 border-b">
      <div className="mx-auto flex w-full max-w-[960px] items-center gap-16 px-4 py-12">
        {showBackLink ? (
          <Link
            href="/"
            className="text-foreground inline-flex items-center gap-2 text-[18px] leading-none font-[400]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            <span>Home</span>
          </Link>
        ) : null}
        <h1 className="text-foreground text-[44px] leading-none font-[400]">
          {farmName}
        </h1>
      </div>
    </div>
  );
}
