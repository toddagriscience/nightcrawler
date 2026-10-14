// Copyright © Todd Agriscience, Inc. All rights reserved.

import { LuLoaderCircle as Loader2Icon } from 'react-icons/lu';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      size={24}
      role="status"
      aria-label="Loading"
      className={cn('size-8 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
