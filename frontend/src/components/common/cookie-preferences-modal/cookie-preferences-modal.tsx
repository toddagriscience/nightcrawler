// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCookiePreferences } from '@/lib/hooks/useCookiePreferences';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
  const { areCookiesEnabled, updatePreferences, isLoading } =
    useCookiePreferences();
  const [localEnabled, setLocalEnabled] = useState(areCookiesEnabled);
  const [isOpen, setIsOpen] = useState(false);

  // Update local state when preferences change or modal opens
  useEffect(() => {
    if (!isLoading && isOpen) {
      async function helper() {
        setLocalEnabled(areCookiesEnabled);
      }
      helper();
    }
  }, [areCookiesEnabled, isLoading, isOpen]);

  const handleSave = () => {
    updatePreferences(localEnabled);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalEnabled(areCookiesEnabled);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={isOpen ? () => setIsOpen(false) : () => {}}
    >
      <DialogTrigger asChild>
        {trigger ? (
          <Button
            className="text-base p-0 h-min m-0 hover:cursor-pointer"
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
          >
            {t('managePreferences')}
            <Image alt="" src={'/privacyoptions.svg'} width={29} height={14} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="py-1">
          <div className="flex space-x-3 flex-col items-start gap-2">
            <div className="flex flex-row flex-nowrap gap-3 items-center">
              <Label
                htmlFor="cookie-toggle"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t('toggleLabel')}
              </Label>
              <Checkbox
                id="cookie-toggle"
                checked={localEnabled}
                onCheckedChange={(checked) => setLocalEnabled(checked === true)}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mt-1">
            {t('toggleDescription')}
          </p>
        </div>
        <DialogFooter>
          <Button className="hover:cursor-pointer" onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button className="hover:cursor-pointer" onClick={handleSave}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
