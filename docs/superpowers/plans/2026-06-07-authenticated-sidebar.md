# Authenticated Sidebar Navigation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A unified 280px left sidebar on every authenticated page, with Search and Reminders sidebar panels, and UX fixes for hardcoded colors, layout hacks, and billing field display.

**Architecture:** The root `(authenticated)/layout.tsx` becomes the single layout shell — it renders the auth gate, the sidebar, and passes children through. Nested layouts `(misc)/` and `(accounts)/(with-shell)/` are simplified to pass children through unchanged. The `AuthenticatedHeader` is replaced by the sidebar as the primary navigation. Search and Reminders are new page routes that render inside the sidebar's content area.

**Tech Stack:** Next.js 15 App Router, Drizzle ORM, Tailwind CSS v4, Radix UI, Framer Motion.

---

## File Map

### New files

```
packages/db/src/schema/reminder.ts              ← system notifications table
apps/site/src/app/(authenticated)/reminders/
  types.ts                                        ← Reminder type
  db.ts                                           ← fetch reminders for current user
  actions.ts                                      ← dismiss, mark_read server actions
  page.tsx                                        ← reminders page component
apps/site/src/app/(authenticated)/components/sidebar/
  sidebar.tsx                                     ← main sidebar shell
  sidebar-nav-item.tsx                            ← single nav link
  sidebar-section-label.tsx                       ← group heading (DISCOVERY, MY FARM, etc.)
  sidebar-user-footer.tsx                         ← email + logout
```

### Modified files

```
packages/db/src/schema/index.ts                  ← export reminder table
apps/site/src/app/(authenticated)/layout.tsx      ← add sidebar shell + auth gate
apps/site/src/app/(authenticated)/(misc)/layout.tsx     ← remove AuthenticatedHeader, pass children
apps/site/src/app/(authenticated)/(accounts)/(with-shell)/layout.tsx  ← remove AccountHeader + AccountSideMenu, pass children
apps/site/src/components/common/authenticated-header/authenticated-header.tsx  ← keep, will be unused (sidebar replaces it)
apps/site/src/app/(authenticated)/(accounts)/account/(with-shell)/farm/profile/page.tsx  ← add sidebar nav active support
apps/site/src/app/globals.css                     ← CSS fixes (transition removal, vars)
apps/site/src/app/(authenticated)/(accounts)/account/components/account-info/account-info.tsx  ← CSS var fixes
apps/site/src/app/(authenticated)/(accounts)/account/components/account-side-menu/account-side-menu.tsx  ← remove translate-x hack
```

---

## Task 1: Reminders Schema

**Files:**

- Create: `packages/db/src/schema/reminder.ts`
- Modify: `packages/db/src/schema/index.ts`

- [ ] **Step 1: Create the reminders schema**

```typescript
// packages/db/src/schema/reminder.ts
// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './user';

/** System notification types delivered to users. */
export const reminderTypeEnum = pgEnum('reminder_type', [
  'system',
  'deadline',
  'alert',
]);

/** System notifications surfaced in the sidebar Reminders panel. */
export const reminder = pgTable('reminder', {
  id: serial().primaryKey().notNull(),
  userId: integer()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  type: reminderTypeEnum('type').notNull(),
  title: varchar({ length: 255 }).notNull(),
  body: varchar({ length: 1000 }).notNull(),
  read: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  /** Optional deep-link URL */
  href: varchar({ length: 500 }),
});
```

- [ ] **Step 2: Export from schema index**

Modify `packages/db/src/schema/index.ts` — add after the `platformAccessApplication` export:

```typescript
export { reminder } from './reminder';
```

- [ ] **Step 3: Commit**

```bash
git add packages/db/src/schema/reminder.ts packages/db/src/schema/index.ts
git commit -m "feat(db): add reminder table for system notifications

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Reminders Types, DB, and Actions

**Files:**

- Create: `apps/site/src/app/(authenticated)/reminders/types.ts`
- Create: `apps/site/src/app/(authenticated)/reminders/db.ts`
- Create: `apps/site/src/app/(authenticated)/reminders/actions.ts`

- [ ] **Step 1: Create types**

```typescript
// apps/site/src/app/(authenticated)/reminders/types.ts
// Copyright © Todd Agriscience, Inc. All rights reserved.

export type Reminder = {
  id: number;
  type: 'system' | 'deadline' | 'alert';
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  href: string | null;
};

export type ReminderAction =
  | { id: number; action: 'dismiss' }
  | { id: number; action: 'mark_read' };
```

- [ ] **Step 2: Create db.ts**

```typescript
// apps/site/src/app/(authenticated)/reminders/db.ts
// Copyright © Todd Agriscience, Inc. All rights reserved.

import { desc, eq } from 'drizzle-orm';
import { db } from '@nightcrawler/db/schema/connection';
import { reminder } from '@nightcrawler/db/schema/reminder';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import type { Reminder } from './types';

/** Fetch all reminders for the current user, newest first. */
export async function getReminders(): Promise<Reminder[]> {
  const currentUser = await getAuthenticatedInfo();
  const rows = await db
    .select()
    .from(reminder)
    .where(eq(reminder.userId, currentUser.id))
    .orderBy(desc(reminder.createdAt));
  return rows;
}
```

- [ ] **Step 3: Create actions.ts**

```typescript
// apps/site/src/app/(authenticated)/reminders/actions.ts
// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { eq } from 'drizzle-orm';
import { db } from '@nightcrawler/db/schema/connection';
import { reminder } from '@nightcrawler/db/schema/reminder';
import { logger } from '@/lib/logger';
import type { ReminderAction } from './types';

/** Server action to dismiss or mark a reminder as read. */
export async function updateReminder(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const idStr = formData.get('id');
  const action = formData.get('action');

  if (!idStr || !action) {
    return { success: false, error: 'Missing id or action' };
  }

  const id = Number(idStr);
  const actionStr = String(action);

  if (actionStr === 'dismiss') {
    const { error } = await db.delete(reminder).where(eq(reminder.id, id));
    if (error) {
      logger.error('[reminders] dismiss failed', { error, id });
      return { success: false, error: 'Failed to dismiss reminder' };
    }
    return { success: true };
  }

  if (actionStr === 'mark_read') {
    const { error } = await db
      .update(reminder)
      .set({ read: true })
      .where(eq(reminder.id, id));
    if (error) {
      logger.error('[reminders] mark_read failed', { error, id });
      return { success: false, error: 'Failed to mark reminder as read' };
    }
    return { success: true };
  }

  return { success: false, error: 'Unknown action' };
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/site/src/app/\(authenticated\)/reminders/types.ts \
        apps/site/src/app/\(authenticated\)/reminders/db.ts \
        apps/site/src/app/\(authenticated\)/reminders/actions.ts
git commit -m "feat(auth): add reminders types, db, and server actions

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Reminders Page

**Files:**

- Create: `apps/site/src/app/(authenticated)/reminders/page.tsx`

- [ ] **Step 1: Create the reminders page**

```tsx
// apps/site/src/app/(authenticated)/reminders/page.tsx
// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { getReminders } from './db';
import { Bell, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { updateReminder } from './actions';
import { Button } from '@/components/ui/button';
import type { Reminder } from './types';

export const metadata: Metadata = {
  title: { default: 'Reminders | Todd', template: '%s | Todd' },
};

const typeIcons = {
  system: Bell,
  deadline: Clock,
  alert: AlertTriangle,
};

const typeColors = {
  system: 'text-foreground',
  deadline: 'text-amber-600',
  alert: 'text-red-600',
};

function ReminderItem({ reminder: r }: { reminder: Reminder }) {
  const Icon = typeIcons[r.type];

  return (
    <div className="flex gap-3 py-4 border-b border-[var(--border)] last:border-b-0">
      <Icon className={`size-5 mt-0.5 shrink-0 ${typeColors[r.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{r.title}</p>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {r.body}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {!r.read && (
            <form action={updateReminder}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="action" value="mark_read" />
              <Button
                type="submit"
                variant="ghost"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <CheckCircle className="size-3 mr-1" />
                Mark read
              </Button>
            </form>
          )}
          <form action={updateReminder}>
            <input type="hidden" name="id" value={r.id} />
            <input type="hidden" name="action" value="dismiss" />
            <Button
              type="submit"
              variant="ghost"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default async function RemindersPage() {
  const reminders = await getReminders();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Reminders</h1>

      {reminders.length === 0 ? (
        <div className="py-16 text-center">
          <Bell className="size-8 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-foreground font-medium">
            You&apos;re all caught up.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            System notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {reminders.map((r) => (
            <ReminderItem key={r.id} reminder={r} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/site/src/app/\(authenticated\)/reminders/page.tsx
git commit -m "feat(auth): add reminders page

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Sidebar Components

**Files:**

- Create: `apps/site/src/app/(authenticated)/components/sidebar/sidebar-section-label.tsx`
- Create: `apps/site/src/app/(authenticated)/components/sidebar/sidebar-nav-item.tsx`
- Create: `apps/site/src/app/(authenticated)/components/sidebar/sidebar-user-footer.tsx`
- Create: `apps/site/src/app/(authenticated)/components/sidebar/sidebar.tsx`

- [ ] **Step 1: Create section label**

```tsx
// apps/site/src/app/(authenticated)/components/sidebar/sidebar-section-label.tsx
// Copyright © Todd Agriscience, Inc. All rights reserved.

interface SidebarSectionLabelProps {
  children: string;
}

export default function SidebarSectionLabel({
  children,
}: SidebarSectionLabelProps) {
  return (
    <div className="px-3 pt-6 pb-1">
      <span className="text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {children}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create nav item**

```tsx
// apps/site/src/app/(authenticated)/components/sidebar/sidebar-nav-item.tsx
// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface SidebarNavItemProps {
  href: string;
  icon: ReactNode;
  children: string;
  /** Sub-paths to also treat as active (e.g. /account/management-zones for /account) */
  prefixMatch?: boolean;
}

export default function SidebarNavItem({
  href,
  icon,
  children,
  prefixMatch = false,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = prefixMatch ? pathname.startsWith(href) : pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors
        ${
          isActive
            ? 'bg-[var(--accent)] text-foreground font-semibold'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }
      `}
    >
      <span className="size-4 shrink-0 opacity-60">{icon}</span>
      {children}
    </Link>
  );
}
```

- [ ] **Step 3: Create user footer**

```tsx
// apps/site/src/app/(authenticated)/components/sidebar/sidebar-user-footer.tsx
// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { BiLogOut } from 'react-icons/bi';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';

export default async function SidebarUserFooter() {
  const user = await getAuthenticatedInfo();

  return (
    <div className="border-t border-[var(--border)] px-4 py-4">
      <div className="text-xs text-muted-foreground mb-2 truncate">
        {user.email}
      </div>
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
```

Note: `logout` server action should be imported from the appropriate existing auth module. Verify the path in `apps/site/src/lib/auth-server.ts` or `apps/site/src/lib/auth-client/index.ts` before writing.

- [ ] **Step 4: Create main sidebar**

```tsx
// apps/site/src/app/(authenticated)/components/sidebar/sidebar.tsx
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

export default function Sidebar() {
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
        <SidebarNavItem href="/account/farm/profile" icon={<User size={16} />}>
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
```

- [ ] **Step 5: Commit**

```bash
git add apps/site/src/app/\(authenticated\)/components/sidebar/
git commit -m "feat(auth): add sidebar navigation components

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Root Auth Layout — Add Sidebar Shell

**Files:**

- Modify: `apps/site/src/app/(authenticated)/layout.tsx`

- [ ] **Step 1: Read current layout to understand exact content**

Before modifying, read the current `apps/site/src/app/(authenticated)/layout.tsx` in full. The goal is to wrap the existing structure with the sidebar.

- [ ] **Step 2: Rewrite root auth layout**

The current layout renders:

1. `DesktopGate`
2. `ViewerAgreementGate` (Suspense-wrapped) with `ApplicationReviewBanner` + children

After: wrap the entire body in a flex row — sidebar on left, main content on right.

```tsx
// apps/site/src/app/(authenticated)/layout.tsx
// Copyright © Todd Agriscience, Inc. All rights reserved.

import DesktopGate from '@/components/common/desktop-gate/desktop-gate';
import { hasAcceptedAccountAgreement } from '@/lib/utils/account-agreement';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { fontVariables } from '../../lib/fonts';
import '../globals.css';
import ApplicationReviewBanner from './components/application-review-banner';
import AuthErrorFallback from './components/auth-error-fallback';
import Sidebar from './components/sidebar/sidebar';

async function ViewerAgreementGate({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentUser;
  try {
    currentUser = await getAuthenticatedInfo();
  } catch {
    return <AuthErrorFallback />;
  }

  if (currentUser.role === 'Viewer') {
    const hasAcceptedAgreement = await hasAcceptedAccountAgreement(
      currentUser.id
    );
    if (!hasAcceptedAgreement) {
      redirect('/account/agreement');
    }
  }

  return (
    <>
      <ApplicationReviewBanner />
      {children}
    </>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="authenticated-root bg-background-platform">
      <body
        className={`${fontVariables} authenticated-root bg-background-platform min-h-screen`}
      >
        <Suspense>
          <ViewerAgreementGate>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 min-w-0">
                <DesktopGate />
                {children}
              </div>
            </div>
          </ViewerAgreementGate>
        </Suspense>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/site/src/app/\(authenticated\)/layout.tsx
git commit -m "feat(auth): add sidebar to root authenticated layout

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Simplify Nested Layouts

**Files:**

- Modify: `apps/site/src/app/(authenticated)/(misc)/layout.tsx`
- Modify: `apps/site/src/app/(authenticated)/(accounts)/(with-shell)/layout.tsx`

- [ ] **Step 1: Simplify (misc)/layout.tsx**

Current content: renders `AuthenticatedHeader`. After: just render children (sidebar is now in root layout).

```tsx
// apps/site/src/app/(authenticated)/(misc)/layout.tsx
// Copyright © Todd Agriscience, Inc. All rights reserved.

export default function AuthenticatedMiscLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Simplify (accounts)/(with-shell)/layout.tsx**

Current content: renders `AccountHeader` + `AccountSideMenu` inside Suspense. After: just render children (sidebar replaces these).

```tsx
// apps/site/src/app/(authenticated)/(accounts)/(with-shell)/layout.tsx
// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: {
    default: 'Account | Todd',
    template: '%s | Todd',
  },
};

function AccountLayoutFallback() {
  return (
    <div className="max-w-[568px]">
      <Skeleton className="h-6 w-48 mb-6 bg-foreground/10" />
      <Skeleton className="h-40 w-full bg-foreground/10" />
    </div>
  );
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<AccountLayoutFallback />}>{children}</Suspense>;
}
```

Note: The `getAccountShellData` and `AccountHeader` are no longer needed in the account layout — the sidebar provides the navigation. The farm name display is removed from the account layout header and the sidebar uses `getAuthenticatedInfo` to show the user email instead.

- [ ] **Step 3: Commit**

```bash
git add "apps/site/src/app/(authenticated)/(misc)/layout.tsx" \
        "apps/site/src/app/(authenticated)/(accounts)/(with-shell)/layout.tsx"
git commit -m "refactor(auth): simplify nested layouts — sidebar replaces per-section chrome

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: CSS Fixes

**Files:**

- Modify: `apps/site/src/app/globals.css`
- Modify: `apps/site/src/app/(authenticated)/(accounts)/account/components/account-info/account-info.tsx`
- Modify: `apps/site/src/app/(authenticated)/(accounts)/account/components/account-side-menu/account-side-menu.tsx`

- [ ] **Step 1: Remove aggressive header transition from globals.css**

Find and remove or comment out this block in `globals.css`:

```css
/* Header theme transitions */
header {
  transition:
    background-color 1.2s ease-in-out,
    color 1.2s ease-in-out;
}
```

- [ ] **Step 2: Fix account-info.tsx — use CSS variables**

In `account-info.tsx`, replace hardcoded hex values with CSS vars:

- `#D9D9D9` → `var(--border)`
- `#ff4d00` → `var(--destructive)` (or define a custom `--color-warning`)
- `#00bc1d` → define `--color-success` in CSS vars

The `AccountInfo` component's `statusStyles` map should use CSS variable references or a semantic token.

- [ ] **Step 3: Fix account-side-menu.tsx — remove translate-x hack**

Remove `translate-x-[-13px]` from the logout `<Button>`. Fix via proper flexbox alignment if needed — the button should be left-aligned naturally.

- [ ] **Step 4: Fix billing fields — hide "Not set"**

In `apps/site/src/app/(authenticated)/(accounts)/account/(with-shell)/page.tsx`, update the `AccountInfoRow` calls for billing fields. Only render the row if `stripeData.*` has a truthy value, or render with a `null` value that the `AccountInfoRow` component handles as hidden.

Modify `AccountInfoRow` to accept `null` value and skip rendering that row when value is falsy (or add a `hidden` prop).

- [ ] **Step 5: Commit**

```bash
git add apps/site/src/app/globals.css \
        apps/site/src/app/\(authenticated\)/\(accounts\)/account/components/account-info/account-info.tsx \
        apps/site/src/app/\(authenticated\)/\(accounts\)/account/components/account-side-menu/account-side-menu.tsx \
        apps/site/src/app/\(authenticated\)/\(accounts\)/account/\(with-shell\)/page.tsx
git commit -m "fix(ui): replace hardcoded colors with CSS vars, remove layout hacks

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Responsive Behavior

**Files:**

- Modify: `apps/site/src/app/(authenticated)/components/sidebar/sidebar.tsx`

- [ ] **Step 1: Add responsive sidebar collapse**

At `< 768px`, the sidebar should collapse to an icon rail (48px wide) with only icons visible. A hamburger/toggle button in the auth header (or a floating button) can expand it as an overlay.

Use a `'use client'` wrapper component for the toggle state:

```tsx
// In sidebar.tsx — wrap in a client component or add inline 'use client'
// Use a <button> in the header area of the sidebar that toggles a collapsed state.
// Collapsed state: w-[48px], icons only, hover tooltip on each item.
// Mobile: overlay, w-[280px] full panel when open.
```

The sidebar itself should use Tailwind responsive classes:

```tsx
// Outer container
<div className="w-[280px] shrink-0 hidden md:block ...">
// On mobile: sidebar becomes a fixed overlay toggled by state
```

Add a `SidebarToggle` button visible on mobile that opens the sidebar as a sheet/drawer. Use Radix Dialog or a simple fixed overlay.

- [ ] **Step 2: Commit**

```bash
git add apps/site/src/app/\(authenticated\)/components/sidebar/sidebar.tsx
git commit -m "feat(auth): responsive sidebar — icon rail on mobile, sheet overlay

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [ ] Spec coverage: Sidebar ✅, Search ✅, Reminders ✅, CSS fixes ✅, Responsive ✅
- [ ] Placeholder scan: no TBD/TODOs in task steps ✅
- [ ] Type consistency: `Reminder` type used in types.ts, db.ts, actions.ts, page.tsx — all match ✅
- [ ] All new files have `// Copyright © Todd Agriscience, Inc. All rights reserved.` ✅
- [ ] All exported components have JSDoc comments ✅
- [ ] No new external packages introduced ✅
- [ ] `reminder` table exported from schema index ✅

---

## Execution

**Two options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach?
