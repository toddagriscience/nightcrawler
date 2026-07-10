// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Single sub-item rendered inside a desktop dropdown or mobile expansion list. */
export interface MenuSubItem {
  title: string;
  url: string;
}

/** Top-level menu entry. May contain nested sub-items rendered in a dropdown. */
export interface MenuItem {
  title: string;
  url: string;
  /** Tagline shown next to the link list when the dropdown is open. */
  description?: string;
  items?: MenuSubItem[];
}

/** Login and contact destinations rendered alongside the main nav. */
export interface AuthLinks {
  login: { title: string; url: string };
  signup: { title: string; url: string };
}

/** Public props for the marketing header. */
export interface HeaderProps {
  className?: string;
  menu?: MenuItem[];
  auth?: AuthLinks;
}

/** Shared props for the desktop and mobile sub-layouts. */
export interface NavLayoutProps {
  menuItems: MenuItem[];
  authLinks: AuthLinks;
}

/** Props for the animated hamburger toggle button. */
export interface HamburgerButtonProps {
  isOpen: boolean;
  label: string;
  onClick: () => void;
}

/** Props for a single desktop menu item (with optional dropdown). */
export interface DesktopMenuItemProps {
  item: MenuItem;
}

/** Props for a single mobile menu item (with optional expand/collapse). */
export interface MobileMenuItemProps {
  item: MenuItem;
  onNavigate: () => void;
}
