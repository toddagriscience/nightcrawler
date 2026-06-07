// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import SidebarSectionLabel from './sidebar-section-label';
import SidebarNavItem from './sidebar-nav-item';
import SidebarUserFooter from './sidebar-user-footer';
import { Search, BookOpen, LayoutDashboard, Map, User, ShoppingCart, Mail, Settings, Bell, Users, Shield, Lock } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-[280px] shrink-0 border-r border-[var(--border)] bg-[var(--background)] flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[var(--border)]">
        <Link href="/" className="text-foreground font-bold text-base tracking-wide wordmark">
          TODD
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2" aria-label="Main navigation">
        <SidebarSectionLabel>Discovery</SidebarSectionLabel>
        <SidebarNavItem href="/search" icon={<Search size={16} />}>
          Search
        </SidebarNavItem>
        <SidebarNavItem href="/search" icon={<BookOpen size={16} />}>
          IMPs
        </SidebarNavItem>

        <SidebarSectionLabel>My Farm</SidebarSectionLabel>
        <SidebarNavItem href="/" icon={<LayoutDashboard size={16} />}>
          Dashboard
        </SidebarNavItem>
        <SidebarNavItem
          href="/account/management-zones"
          icon={<Map size={16} />}
          prefixMatch
        >
          Zones
        </SidebarNavItem>
        <SidebarNavItem
          href="/account/farm/profile"
          icon={<User size={16} />}
        >
          Farm Profile
        </SidebarNavItem>

        <SidebarSectionLabel>Tools</SidebarSectionLabel>
        <SidebarNavItem href="/order" icon={<ShoppingCart size={16} />}>
          Order
        </SidebarNavItem>
        <SidebarNavItem href="/contact" icon={<Mail size={16} />}>
          Contact
        </SidebarNavItem>

        <SidebarSectionLabel>Account</SidebarSectionLabel>
        <SidebarNavItem href="/account" icon={<Settings size={16} />}>
          Account
        </SidebarNavItem>
        <SidebarNavItem href="/account/users" icon={<Users size={16} />}>
          Users
        </SidebarNavItem>
        <SidebarNavItem href="/account/security" icon={<Shield size={16} />}>
          Security
        </SidebarNavItem>
        <SidebarNavItem href="/account/privacy" icon={<Lock size={16} />}>
          Privacy
        </SidebarNavItem>

        <SidebarSectionLabel>System</SidebarSectionLabel>
        <SidebarNavItem href="/reminders" icon={<Bell size={16} />}>
          Reminders
        </SidebarNavItem>
      </nav>

      {/* User footer */}
      <SidebarUserFooter />
    </aside>
  );
}