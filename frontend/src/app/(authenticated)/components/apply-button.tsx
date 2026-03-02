// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

export default function ApplyButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/apply')}
      variant={'brand'}
      className="min-w-45 hover:cursor-pointer"
    >
      Apply to Todd
    </Button>
  );
}
