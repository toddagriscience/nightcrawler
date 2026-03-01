// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { HiArrowLongRight } from 'react-icons/hi2';

/**
 * This is the Creators page for the Todd go domain UGC Program.
 * @returns {JSX.Element} - The creators subdomain page
 */
export default function CreatorsPage() {
  return (
    <div>
      {/* Apply Section */}
      <div className="w-full h-fit mb-16 md:mb-32 py-12 md:py-16">
        <Link
          href="#"
          className="text-3xl md:text-4xl lg:text-4xl leading-tight font-thin flex justify-center items-center gap-5"
        >
          Apply
          <span className="mt-1">
            <HiArrowLongRight className="size-12" />
          </span>
        </Link>
      </div>
    </div>
  );
}
