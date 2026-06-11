// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useTransition } from 'react';
import { Icon } from '@/components/common/icon/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Portal } from '@/components/common/portal';
import { createManagementZone } from '@/app/(authenticated)/(accounts)/account/(with-shell)/management-zones/[zone]/actions';

export default function NewZoneButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    startTransition(async () => {
      try {
        await createManagementZone(name.trim());
        setIsOpen(false);
        setName('');
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create zone');
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
      >
        <Icon src="/icons/plus.svg" className="size-4 opacity-60" />
        New Zone
      </button>

      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center isolate">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative z-[9999] w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  New Zone
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon src="/icons/x.svg" className="size-4" />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="zone-name"
                    className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block"
                  >
                    Zone name
                  </label>
                  <Input
                    id="zone-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., North Field"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="brand"
                    disabled={isPending || !name.trim()}
                  >
                    {isPending ? 'Creating...' : 'Create zone'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
