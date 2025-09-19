// Copyright Todd LLC, All rights reserved.

'use client';

import Link from 'next/link';

/**
 * Not found page for authenticated users (dashboard)
 * Uses theme-aware styling to match the dashboard design
 * @returns {React.ReactNode} - The not found page component
 */
export default function DashboardNotFound() {
  return (
    <div className="min-h-screen flex items-end justify-start p-8 md:p-16 pb-16 md:pb-24 bg-[#F7F4EC]">
      <div className="flex flex-col md:flex-row items-end gap-8 md:gap-16 max-w-8xl">
        <div className="text-[120px] md:text-[240px] font-light leading-none text-[#555555] mb-4 md:mb-8">
          404
        </div>
        <div className="flex flex-col items-start gap-8 max-w-3xl">
          <p className="text-xl md:text-[32px] text-[#555555] font-light leading-normal">
            The page you are looking for could not be found. Please check the
            URL and try again, or return to the dashboard.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#555555] text-white rounded-md hover:bg-[#444444] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
