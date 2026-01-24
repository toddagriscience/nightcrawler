// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

export default function ApplyButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/apply')}
      className="w-full bg-black text-white hover:cursor-pointer hover:bg-black/80 rounded-full max-w-50"
    >
      APPLY
    </Button>
  );
}
