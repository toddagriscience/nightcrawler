// Copyright © Todd Agriscience, Inc. All rights reserved.

import ToddHeader from '@/components/common/wordmark/todd-wordmark';

/**
 * Banner chrome for every `/account/*` page. No layout above the account shell
 * renders any chrome, so this is the only `role="banner"` in the account area.
 *
 * Branding only, per maintainer direction on #1012: the farm name and the Home
 * link are not part of the header. The farm name now heads the account side
 * menu, and the route back out of `/account/*` sits in that side menu's site
 * navigation. The wordmark itself still links home, so the banner remains an
 * escape hatch even though it carries no separate Home link.
 *
 * @returns The account banner containing the Todd wordmark
 */
export default function AccountHeader() {
  return (
    <header className="w-full border-b border-[#D9D9D9]" role="banner">
      <div className="mx-auto mt-4 max-w-[107rem] px-4 py-4 sm:px-6 lg:px-8">
        <ToddHeader className="flex min-h-10 flex-row items-center" />
      </div>
    </header>
  );
}
