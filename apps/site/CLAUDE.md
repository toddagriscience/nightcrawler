# apps/site — Development Context

> Repo-wide conventions (naming, feature-sliced design, logging, JSDoc, commit and
> PR workflow, commands) live in [`AGENTS.md`](../../AGENTS.md) and are **not**
> repeated here. Read that first. This file covers only what is specific to
> `apps/site`.

## What this app is

The Next.js application behind Todd Agriscience: a public marketing site and an
authenticated customer platform in one App Router tree.

- **Marketing site** — everything under the `[locale]` route; internationalized.
- **Platform** — the authenticated routes; not internationalized.

## Tech stack

Versions here are the ones actually declared in `package.json`. Update this list
when you bump them.

### Core

- Next.js `16.3.0-canary.37`, App Router, Turbopack
- React `19.2`, TypeScript `5.9` (strict)
- Tailwind CSS `4.2`
- Drizzle ORM `0.45` over PostgreSQL, via `@nightcrawler/db`

### UI

- shadcn/ui on Radix primitives (`src/components/ui/`)
- `class-variance-authority` for component variants
- `lucide-react` for icons; `react-icons` for brand logos
- `clsx` + `tailwind-merge` for conditional styling

### Content, data, and services

- `next-sanity` `12.2` — CMS content (articles, careers, forms, governance)
- `@supabase/supabase-js` `2.102` — auth
- `stripe` `20.4` — billing
- `posthog-js` `1.365` — analytics
- `newrelic` `13.20` — APM, wired through `src/instrumentation/`

### Internationalization

- `next-intl` `4.9`, locales `en` and `es`, English fallback
- Type-safe translations with parameter interpolation

### Animation

- `framer-motion` `12.38`
- `@studio-freight/lenis` `1.0` for smooth scrolling
- `embla-carousel-react` `8.6`

### Development

- Vitest `4.1` + React Testing Library `16.3`
- Storybook `10.3` with the a11y addon

## Directory structure

```
src/
  app/                     # Next.js App Router
    (unauthenticated)/     # Public routes
      [locale]/            # Internationalized marketing site
    (authenticated)/       # Customer platform (not internationalized)
    (go)/                  # Standalone campaign routes
    (viewer-agreement)/
    api/                   # Route handlers
    globals.css            # Global styles + CSS variables
    providers.tsx          # Client providers
  components/
    common/                # Reusable app components
    sanity/                # Sanity content renderers
    go/                    # Campaign-specific components
    ui/                    # shadcn/ui primitives (button.tsx, etc.)
  context/
    theme/                 # Theme + dark-mode context
  data/                    # Static data files
  i18n/
    config.ts              # Routing / locale config
    request.ts             # Server-side message loading
    message-files.ts       # Namespace list driving the dynamic import
  instrumentation/         # New Relic agent wiring
  lib/
    actions/               # Server actions
    ai/  order/  sanity/  stripe/  supabase/  utils/
    hooks/                 # Shared React hooks
    types/                 # Shared TypeScript types
    env.ts  fonts.ts  logger.ts  metadata.ts  locales.ts
  messages/                # One directory per namespace, each with en.json + es.json
  test/
    test-utils.tsx         # React Testing Library setup
  instrumentation.ts       # Next.js instrumentation entry
  proxy.ts                 # next-intl proxy (Next 16's replacement for middleware.ts)
public/                    # Static assets, fonts, publications
scripts/                   # Build and utility scripts
.storybook/                # Storybook configuration
components.json            # shadcn/ui configuration
```

## Component organization

Page-specific components are co-located with the page that uses them; test and
Storybook files sit alongside the component:

```
app/
└── (unauthenticated)/
    └── [locale]/
        └── about/
            ├── components/
            │   └── hero/
            │       ├── types/
            │       │   └── hero.ts
            │       ├── hero.tsx
            │       ├── hero.test.tsx
            │       └── hero.stories.tsx
            └── page.tsx
```

Genuinely reusable components go in `src/components/common/`; shadcn/ui
primitives are flat files in `src/components/ui/`.

## Adding a component

- Co-locate it with its page unless it is used across the app.
- Use `class-variance-authority` for styling variants.
- Integrate with the existing `ThemeContext` where relevant.
- Use `next-intl` for any user-facing text on the marketing site.
- Include a unit test and a Storybook story.
- Prefer shadcn/ui primitives over hand-rolled equivalents.

## Site-specific commands

Run these from `apps/site` — they do not exist at the repository root.

- `bun run ci` — `type-check` → `lint` → `test` → `build`
- `bun run validate` — `format:check` → `ci`
- `bun run lint:fix` — applies license headers, ESLint `--fix`, then formats
- `bun run test:watch` / `bun run test:coverage`
- `bun run storybook` — component explorer on port 6006

### A note on `no-secrets`

We use [`eslint-plugin-no-secrets`](https://github.com/nickdeis/eslint-plugin-no-secrets)
to catch credentials committed as plaintext. It occasionally false-positives. When
it does:

```ts
// eslint-disable-next-line no-secrets/no-secrets
```

## Logging

Use `import { logger } from '@/lib/logger'`. Levels and the production-visibility
rule are documented in [`AGENTS.md`](../../AGENTS.md#logging).

## Internationalization

Locales are `en` and `es`, with English as the fallback. Only the marketing site
(the `[locale]` routes) is internationalized.

Messages live in `src/messages/<namespace>/{en,es}.json`. The namespace list in
`src/i18n/message-files.ts` drives a dynamic import in `src/i18n/request.ts` — a
new namespace directory is invisible until it is added to that array.

Routing is configured in `src/i18n/config.ts`:

- `localePrefix: 'as-needed'` — the default locale has no URL prefix.
- `localeDetection: process.env.NODE_ENV === 'production'` — negotiation from the
  request (`Accept-Language`, `NEXT_LOCALE` cookie) is **on in production only**.
  In development the locale always comes from the URL, so detection bugs will not
  reproduce locally.

To add a locale, update `src/lib/locales.ts` and `src/i18n/config.ts`, then add
the matching JSON file to every namespace directory.

## Styling

Global styles and CSS variables live in `src/app/globals.css`. Marketing and
platform routes read their background from `--background` and
`--background-platform` respectively.
