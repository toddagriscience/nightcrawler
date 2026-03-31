// Copyright © Todd Agriscience, Inc. All rights reserved.

import ToddHeader from '@/components/common/wordmark/todd-wordmark';

/**
 * Header component for Go UGC Program page
 * Displays the TODD brand and page title
 * @returns {JSX.Element} - The Go UGC Program header component
 */
export default function GoHeader() {
  return (
    <header className="w-full" role="banner">
      <div className="mx-auto mt-4 px-6 sm:mx-6 md:mx-10 xl:mx-34">
        <div className="flex items-baseline justify-between h-0 md:h-3 lg:h-5">
          <ToddHeader className="flex min-h-10 flex-row items-center" />
          <h1 className="text-xl sm:text-2xl font-normal">Creator Program</h1>
        </div>
      </div>
    </header>
  );
}
