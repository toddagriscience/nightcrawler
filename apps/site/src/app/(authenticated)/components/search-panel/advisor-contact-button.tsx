// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type {
  InferenceContactInput,
  InferenceContactResult,
} from '@/app/(authenticated)/(shell)/(misc)/support/contact/types';

interface AdvisorContactButtonProps {
  questions: string[];
  managementZoneId?: number;
  onTransferred?: () => void;
  /** Isolated replacement for previews; production calls the authorized server action. */
  prepareAction?: (
    input: InferenceContactInput
  ) => Promise<InferenceContactResult>;
}

/** Transfers unanswered questions to the advisor form without exposing them in a URL. */
export function AdvisorContactButton({
  questions,
  managementZoneId,
  onTransferred,
  prepareAction,
}: AdvisorContactButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function transfer() {
    setPending(true);
    setError(null);
    try {
      const prepare =
        prepareAction ??
        (
          await import('@/app/(authenticated)/(shell)/(misc)/support/contact/inference-actions')
        ).prepareInferenceContact;
      const result = await prepare({ questions, managementZoneId });
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push(result.url);
      onTransferred?.();
    } catch {
      setError('Your questions could not be transferred. Please try again.');
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="mt-4 space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={transfer}
        disabled={pending}
      >
        {pending ? 'Transferring…' : 'Contact an advisor'}
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
