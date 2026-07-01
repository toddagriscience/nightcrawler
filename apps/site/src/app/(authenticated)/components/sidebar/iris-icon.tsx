// Copyright © Todd Agriscience, Inc. All rights reserved.

import Image from 'next/image';

/**
 * Iris mark used in the authenticated sidebar navigation.
 *
 * @returns The iris icon image
 */
export default function IrisIcon() {
  return (
    <Image
      src="/iris-icon.png"
      alt=""
      width={16}
      height={16}
      className="size-4"
      aria-hidden
    />
  );
}
