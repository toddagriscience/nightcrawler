// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { logout } from '@/lib/auth';
import { useRouter } from '@/i18n/config';

/**
 * Logout link component - styled as a simple clickable link matching the platform style
 * @returns {JSX.Element} - A logout link with Supabase logout functionality
 */
export default function LogoutLink() {
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
      onClick={handleLogout}
      className="text-foreground text-sm hover:opacity-70 transition-opacity underline"
    >
      Logout
    </button>
  );
}
