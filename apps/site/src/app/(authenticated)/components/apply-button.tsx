// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function ApplyButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/apply')}
      variant={'brand'}
      className="h-11 w-45 hover:cursor-pointer rounded-full text-foreground text-white"
    >
      Apply to Todd
    </Button>
  );
}
