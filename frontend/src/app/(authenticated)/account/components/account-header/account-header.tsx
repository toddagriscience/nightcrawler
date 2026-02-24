// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AccountHeaderProps {
  farmName: string;
}

export default function AccountHeader({ farmName }: AccountHeaderProps) {
  return (
    <div className="border-b border-black/10">
      <div className="mx-auto flex w-full max-w-[960px] items-center gap-16 px-4 py-12">
        <Link
          href="/"
          className="text-foreground inline-flex items-center gap-2 text-[18px] leading-none font-[400]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          <span>Home</span>
        </Link>
        <h1 className="text-foreground text-[44px] leading-none font-[400]">
          {farmName}
        </h1>
      </div>
    </div>
  );
}
