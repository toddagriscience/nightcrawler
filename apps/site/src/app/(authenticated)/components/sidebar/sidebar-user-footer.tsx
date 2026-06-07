// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';
import { BiLogOut } from 'react-icons/bi';

interface SidebarUserFooterProps {
  email: string;
}

export default function SidebarUserFooter({ email }: SidebarUserFooterProps) {
  return (
    <div className="border-t border-[var(--border)] px-4 py-4">
      <div className="text-xs text-muted-foreground mb-2 truncate">{email}</div>
      <form
        action={async () => {
          'use server';
          await logout();
        }}
      >
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-8 px-2"
        >
          <BiLogOut className="size-4" />
          Log out
        </Button>
      </form>
    </div>
  );
}
