// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { logout } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface LogoutLinkProps {
  className?: string;
  label?: string;
}

/**
 * Logout link component - styled as a simple clickable link matching the platform style
 * @returns {JSX.Element} - A logout link with Supabase logout functionality
 */
export default function LogoutLink({
  className,
  label = 'Logout',
}: LogoutLinkProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    // If logout doesn't redirect automatically, manually redirect
    if (!result?.error) {
      router.push('/en');
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        'text-foreground text-sm hover:opacity-70 transition-opacity underline'
      }
    >
      {label}
    </button>
  );
}
