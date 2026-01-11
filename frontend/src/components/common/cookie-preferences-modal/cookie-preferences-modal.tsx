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
 * Cookie Preferences Modal Component
 * Allows users to toggle cookies on/off
 */
export default function CookiePreferencesModal() {
  const t = useTranslations('cookiePreferences');
  const [internalOpen, setInternalOpen] = useState(false);
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
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hover:cursor-pointer flex items-center gap-1.5 text-foreground"
          >
            {t('managePreferences')}
            <Image alt="" src={'/privacyoptions.svg'} width={29} height={14} />
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="cookie-toggle"
              checked={localEnabled}
              onCheckedChange={(checked) => setLocalEnabled(checked === true)}
            />
            <div className="flex-1">
              <Label
                htmlFor="cookie-toggle"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t('toggleLabel')}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {t('toggleDescription')}
              </p>
            </div>
          </div>
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
