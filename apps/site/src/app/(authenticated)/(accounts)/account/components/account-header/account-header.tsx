// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import ToddHeader from '../../../../../../components/common/wordmark/todd-wordmark';

interface AccountHeaderProps {
  farmName: string;
}

export default function AccountHeader({ farmName }: AccountHeaderProps) {
  return (
    <>
      <header className="w-full" role="banner">
        <div className="mx-auto max-w-[107rem] mt-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <ToddHeader className="flex min-h-10 flex-row items-center" />
          </div>
        </div>
      </header>
      <div className="border-b border-[#D9D9D9]">
        <div className="mx-auto flex w-full max-w-[1300px] items-center gap-22 px-5 mt-5 mb-10">
          <Link
            href="/"
            className="text-foreground inline-flex items-center gap-2 mt-[-4px] hover:opacity-70"
          >
            <BiArrowBack className="size-4" />
            <span className="text-lg leading-none font-normal text-foreground text-lg tracking-tight">
              Home
            </span>
          </Link>
          <h1 className="text-foreground text-4xl leading-none font-light">
            {farmName}
          </h1>
        </div>
      </div>
    </>
  );
}
