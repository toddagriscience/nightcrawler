// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { HiArrowLongRight } from 'react-icons/hi2';
import HeaderImg from '@/components/common/header-img/header-img';

/**
 * Creators page for the Todd go domain UGC Program
 * @returns {JSX.Element} - The creators subdomain page
 */
export default function CreatorsPage() {
  return (
<<<<<<< HEAD
    <main>
      {/* Header Image */}
      <div className="max-w-[1400px] mx-auto">
        <HeaderImg
          src="/marketing/creators-header.webp"
          alt="Creators Program"
          overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent transition-all duration-200 ease-in-out"
        />
      </div>

      {/* Page Content */}
      <div className="flex flex-col mx-auto max-w-[1200px] px-12 md:px-20 lg:px-26 py-16">
        <div className="max-w-[800px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-light mb-6">
            Todd Creators Program
          </h1>

          <p className="text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Join the Todd United States creators community and help us share
            innovative agricultural solutions with the world. Collaborate,
            create, and grow with us.
          </p>
        </div>
      </div>
    </main>
=======
    <>
      <HeaderImg
        src="/marketing/m4a.jpg"
        alt="Garden"
        overlayClassName="bg-gradient-to-t from-black/20 via-black/10 to-transparent"
      />

      <div className="max-w-[1400px] mx-auto">
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
    </>
>>>>>>> 24f14ed (style: update and formatting image)
  );
}
