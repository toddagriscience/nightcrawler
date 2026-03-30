// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * Toast notification provider using Sonner.
 * Provides success (green), warning (yellow), and error (red) notifications.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success:
            'group-[.toaster]:!bg-green-50 group-[.toaster]:!text-green-900 group-[.toaster]:!border-green-200',
          warning:
            'group-[.toaster]:!bg-yellow-50 group-[.toaster]:!text-yellow-900 group-[.toaster]:!border-yellow-200',
          error:
            'group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-900 group-[.toaster]:!border-red-200',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
