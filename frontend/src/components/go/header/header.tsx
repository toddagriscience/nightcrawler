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
      <div className="mx-auto max-w-[107rem] mt-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <ToddHeader className="flex min-h-10 flex-row items-center" />
          <h1 className="text-xl sm:text-2xl font-normal mr-18">
            Creator Program
          </h1>
        </div>
      </div>
    </header>
  );
}
