// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCookiePreferences } from '@/lib/hooks/useCookiePreferences';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/config';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

/**
 * Cookie Preferences modal. Allows users to toggle cookies on/off.
 *
 * @param {React.ReactNode} trigger - The element that opens the modal. Optional, defaults to a button.
 * @returns {JSX.Element} - The Cookie Preferences modal with related logic.
 */
export default function CookiePreferencesModal({
  trigger = undefined,
}: {
  trigger?: React.ReactNode;
}) {
  const t = useTranslations('cookiePreferences');
  const { isCapturing, applyPostHogPreference } = useCookiePreferences();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={isOpen ? () => setIsOpen(false) : () => {}}
    >
      <DialogTrigger asChild>
        {trigger ? (
          <Button
            className="m-0 h-min p-0 text-base hover:cursor-pointer"
            onClick={() => setIsOpen(true)}
            asChild
          >
            {trigger}
          </Button>
        ) : (
          <Button
            type="button"
            variant={'outline'}
            onClick={() => setIsOpen(true)}
            className="hover:cursor-pointer"
          >
            {t('buttonText')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="text-base">
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p>{t('toggleDescription')}</p>
        </div>
        <DialogFooter>
          <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
            <Link
              onClick={() => setIsOpen(false)}
              locale="en"
              href={'/privacy'}
              className="underline"
            >
              US Privacy Policy
            </Link>
            <div className="flex flex-row items-center gap-2">
              <Switch
                className={isCapturing ? 'bg-green-500' : 'bg-gray-500'}
                checked={isCapturing}
                onCheckedChange={(checked) => applyPostHogPreference(checked)}
              />
              <Label>Do not sell or share my personal information</Label>
            </div>
            <Button
              className="rounded-4xl border border-solid border-black px-8 py-2 hover:cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              {t('save')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
