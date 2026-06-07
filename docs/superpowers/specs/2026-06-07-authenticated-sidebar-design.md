# Authenticated Navigation + Search/Reminders Sidebar

## Status

Approved for implementation.

---

## Overview

Replace the split authenticated layout system with a single unified sidebar navigation accessible from all authenticated pages. Add a Search sidebar replacing the current `/search` page, add a Reminders section (system notifications), and fix UX inconsistencies identified in the UI review.

---

## Layout

### Unified Authenticated Layout

Every authenticated page (`/(authenticated)/**`) uses a single layout: fixed 280px left sidebar + main content area.

**Replaces:**

- `(misc)/layout.tsx` — auth header only (simplified, sidebar added)
- `(accounts)/(with-shell)/layout.tsx` — header + side menu (replaced by unified sidebar)
- `(authenticated)/layout.tsx` — root gate (simplified)

**Route structure unchanged** — no file moves. Sidebar added to `(authenticated)/layout.tsx`. Individual page layouts (`(misc)/`, `(accounts)/`) simplified to just render their page content, sidebar is handled by root auth layout.

**New files:**

````
apps/site/src/app/(authenticated)/
  layout.tsx                          ← add sidebar shell
  components/sidebar/
    sidebar.tsx                       ← main sidebar component
    sidebar-nav-item.tsx              ← nav item with active state
    sidebar-user-footer.tsx           ← email + logout
    sidebar-section-label.tsx          ← group label (DISCOVERY, MY FARM, etc.)
apps/site/src/app/(authenticated)/search/
  page.tsx                            ← existing, wired to sidebar nav
apps/site/src/app/(authenticated)/reminders/
  page.tsx                            ← new reminders panel
  actions.ts                          ← server actions (dismiss, mark-read)
  db.ts                               ← fetch reminders
  types.ts                            ← Reminder type

### Sidebar Structure

280px fixed panel, left side, full viewport height. Scrollable nav area + fixed user footer at bottom.

**Sections:**

| Group | Items |
|-------|-------|
| Discovery | Search, IMPs |
| My Farm | Dashboard, Zones, Farm Profile |
| Tools | Order, Contact |
| Account | Account, Users, Security, Privacy |
| System | Reminders |

**Apply** — hidden from sidebar (redirect handles unapproved users).

**Active state** — `aria-current="page"`, `font-bold`, background `#f0f0f0`.

**User footer** — shows logged-in email + logout link.

### Content Area

Rest of screen width, max content width per page preserved. Pages that previously used full width (dashboard) shift to accommodate sidebar.

---

## Pages

### Search (sidebar panel)

Replaces `/search`. Full-width search input at top of content area, results below. URL-driven (`?q=...`).

- `GET /search` — search input + empty state
- `GET /search?q=carrots` — search input + results list
- Results: semantic matches from knowledge base (existing `searchKnowledge`)

No new search logic — wire existing search to the sidebar nav.

### Reminders (sidebar panel)

System notifications. Read-only list, user can dismiss or mark as read.

- `GET /reminders` — list of system notifications
- `POST /reminders` with `{id, action: "dismiss"|"mark_read"}` — update reminder

**Data model:**

```ts
type Reminder = {
  id: string;
  type: 'system' | 'deadline' | 'alert';
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  href?: string; // optional deep link
};
````

**DB:** `reminders` table in `packages/db/src/schema/`.

**API:** Server actions in `reminders/actions.ts`.

**Empty state:** "You're all caught up."

### IMPs (sidebar nav item)

Links to `/search` — the existing knowledge base search surfaces IMPs. Sidebar item provides discoverability. Existing `/imp/[slug]` pages remain as detail views (deep-link from search results).

### Dashboard

`/` — unchanged content, new layout with sidebar.

### Zones

`/account/management-zones` — list of management zones. Sidebar highlights Zones when on this path. `/account/management-zones/[zone]` (zone detail) also highlights Zones.

### Farm Profile

`/account/farm/profile` — unchanged URL. Sidebar highlights Farm Profile when on this path.

### Account

`/account` — unchanged content, new sidebar nav position.

### Users, Security, Privacy

Unchanged URLs, new sidebar nav position.

### Order, Contact

Unchanged URLs/content, new sidebar nav position.

---

## Route Cleanup

All existing authenticated URLs remain functional. The sidebar provides navigation clarity so users always know where they are regardless of URL.

- `/account/management-zones` — kept, sidebar highlights Zones
- `/account/farm/profile` — kept, sidebar highlights Farm Profile
- `/welcome` — kept, redirects to `/`

No URL redirects needed. The sidebar makes the site navigable regardless of how users arrive at a URL.

---

## CSS Fixes

- Replace all hardcoded hex values in components with CSS variables (`var(--border)`, `var(--foreground)`, etc.)
- Remove `translate-x-[-13px]` from logout button — fix via proper flex layout
- Remove `transition: all 1.2s ease-in-out` from `header` in globals.css
- Fix account skeleton to match real layout (no hardcoded background)
- "Not set" billing fields → render only when data exists, hide otherwise

---

## Responsive

- **< 768px**: sidebar collapses to icon rail (48px), tap to expand as overlay
- **768px+**: full 280px fixed sidebar

---

## Dependencies

- `reminders` table in `packages/db/src/schema/` — created via migration
- No new external packages
- Existing auth flow unchanged

---

## Out of Scope

- Real-time notification push (polling OK for initial version)
- Reminder creation (system-generated only)
- Mobile-first redesign
- Landing page changes
