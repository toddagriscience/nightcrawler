// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Brand page component
 * @returns {JSX.Element} - The brand page
 */
export default function BrandPage() {
  return (
    <div className="max-w-[1400px] mx-auto my-30 flex items-center justify-center">
      {/* Header */}
      <div className="flex flex-col gap-4 justify-center items-center">
        <span className="text-xs md:text-sm text-foreground">Company</span>
        <h1 className="text-4xl md:text-5xl lg:text-[64px]">
          Design Guidelines
        </h1>
      </div>
    </div>
  );
}
