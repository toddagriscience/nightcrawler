// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LuUsers as Users,
  LuTractor as Tractor,
  LuFlaskConical as FlaskConical,
  LuFileText as FileText,
  LuSprout as Sprout,
  LuLayoutDashboard as LayoutDashboard,
  LuColumns3 as Columns3,
  LuShieldCheck as ShieldCheck,
  LuLogOut as LogOut,
  LuClipboardList as ClipboardList,
  LuFilePenLine as FileSignature,
} from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import type { IconType } from 'react-icons';

/** Navigation item definition */
interface NavItem {
  /** Display label */
  label: string;
  /** Route path */
  href: string;
  /** Icon component from react-icons. */
  icon: IconType;
}

/** Navigation items for the sidebar */
const navItems: NavItem[] = [
  { label: 'Internal Accounts', href: '/', icon: ShieldCheck },
  { label: 'Applications', href: '/applications', icon: ClipboardList },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Farms', href: '/farms', icon: Tractor },
  { label: 'Analyses', href: '/analyses', icon: FlaskConical },
  { label: 'IMPs', href: '/imps', icon: FileText },
  { label: 'Seed Products', href: '/seed-products', icon: Sprout },
  { label: 'Tabs & Widgets', href: '/tabs-widgets', icon: Columns3 },
  { label: 'Offer Letters', href: '/offer-letters', icon: FileSignature },
];

/**
 * Vertical sidebar navigation for the internal dashboard.
 * Displays navigation links and a logout button.
 */
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      logger.error('Failed to log out:', error);
    }
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <LayoutDashboard size={24} aria-hidden="true" className="h-5 w-5" />
          <span className="text-lg font-bold">Todd Internal</span>
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon size={24} aria-hidden="true" className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
          aria-label="Sign out"
        >
          <LogOut size={24} aria-hidden="true" className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
