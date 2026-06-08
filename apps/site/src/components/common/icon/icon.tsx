// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Image from 'next/image';

interface IconProps {
  src: string;
  className?: string;
}

export function Icon({ src, className = '' }: IconProps) {
  return (
    <Image
      src={src}
      alt=""
      width={16}
      height={16}
      className={className}
      aria-hidden="true"
    />
  );
}
