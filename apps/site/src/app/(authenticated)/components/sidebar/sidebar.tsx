// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import SidebarSectionLabel from './sidebar-section-label';
import SidebarNavItem from './sidebar-nav-item';
import SidebarUserFooter from './sidebar-user-footer';
import {
  Search,
  BookOpen,
  LayoutDashboard,
  Map,
  User,
  ShoppingCart,
  Mail,
  Settings,
  Bell,
  Users,
  Shield,
  Lock,
} from 'lucide-react';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';

export default async function Sidebar() {
  const user = await getAuthenticatedInfo();

  return (
    <aside className="w-[280px] shrink-0 border-r border-[var(--border)] bg-[var(--background)] flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[var(--border)]">
        <Link
          href="/"
          className="text-foreground font-bold text-base tracking-wide wordmark"
        >
          TODD
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2" aria-label="Main navigation">
        <SidebarSectionLabel>Discovery</SidebarSectionLabel>
        <SidebarNavItem href="/search" icon={<Search />}>
          Search
        </SidebarNavItem>
        <SidebarNavItem href="/search" icon={<BookOpen />}>
          IMPs
        </SidebarNavItem>

        <SidebarSectionLabel>My Farm</SidebarSectionLabel>
        <SidebarNavItem href="/" icon={<LayoutDashboard />}>
          Dashboard
        </SidebarNavItem>
        <SidebarNavItem
          href="/account/management-zones"
          icon={<Map />}
          prefixMatch
        >
          Zones
        </SidebarNavItem>
        <SidebarNavItem href="/account/farm/profile" icon={<User />}>
          Farm Profile
        </SidebarNavItem>

        <SidebarSectionLabel>Tools</SidebarSectionLabel>
        <SidebarNavItem href="/order" icon={<ShoppingCart />}>
          Order
        </SidebarNavItem>
        <SidebarNavItem href="/contact" icon={<Mail />}>
          Contact
        </SidebarNavItem>

        <SidebarSectionLabel>Account</SidebarSectionLabel>
        <SidebarNavItem href="/account" icon={<Settings />}>
          Account
        </SidebarNavItem>
        <SidebarNavItem href="/account/users" icon={<Users />}>
          Users
        </SidebarNavItem>
        <SidebarNavItem href="/account/security" icon={<Shield />}>
          Security
        </SidebarNavItem>
        <SidebarNavItem href="/account/privacy" icon={<Lock />}>
          Privacy
        </SidebarNavItem>

        <SidebarSectionLabel>System</SidebarSectionLabel>
        <SidebarNavItem href="/reminders" icon={<Bell />}>
          Reminders
        </SidebarNavItem>
      </nav>

      {/* User footer */}
      <SidebarUserFooter email={user.email} />
    </aside>
  );
}
