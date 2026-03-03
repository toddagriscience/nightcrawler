// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';

interface AccountHeaderProps {
  farmName: string;
}

export default function AccountHeader({ farmName }: AccountHeaderProps) {
  return (
    <div className="border-b border-[#D9D9D9]">
      <div className="mx-auto flex w-full max-w-[1300px] items-end gap-22 px-5 mt-16 mb-10">
        <Link
          href="/"
          className="text-foreground inline-flex items-center gap-2 text-[18px] leading-none font-[400]"
        >
          <BiArrowBack className="size-4" />
          <span className="text-lg leading-none">Home</span>
        </Link>
        <h1 className="text-foreground text-4xl leading-none font-light">
          {farmName}
        </h1>
      </div>
    </div>
  );
}
