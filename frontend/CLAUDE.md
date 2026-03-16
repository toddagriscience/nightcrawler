# ToddAgriScience Website - Development Context

## Project Overview

A modern, production-ready Next.js website for Todd Agriscience with comprehensive development infrastructure, smooth user experience, and complete SEO optimization. This codebase emphasizes maintainability, type safety, internationalization support, and component-driven architecture.

## Tech Stack

### Core Framework

- **Next.js 16** with App Router & Turbopack
- **TypeScript** with strict type checking
- **Tailwind CSS v4** with custom brand configuration
- **React 19** with modern hooks and patterns
- **Drizzle ORM** with PostgreSQL (16 schema tables)

### Authentication & Backend

- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) for authentication and database access
- Server-side client in `src/lib/supabase/server.ts`, browser client in `src/lib/supabase/client.ts`
- Auth utilities: `src/lib/auth-client.ts`, `src/lib/auth-server.ts`
- Server actions for auth: `src/lib/actions/auth.ts`

### Content Management

- **Sanity CMS** (`next-sanity`, `@sanity/image-url`) for news and governance content
- Standalone **Sanity Studio** in `/sanity-studio/` (separate package, schemas for news + governance profiles)
- Sanity client in `src/lib/sanity/`, rendering components in `src/components/sanity/`

### Payments

- **Stripe** v20 for subscription billing
- Webhook handler at `src/app/api/stripe/webhook/`
- Stripe utilities in `src/lib/utils/stripe/`

### Analytics

- **PostHog** (`posthog-js`, `@posthog/react`) for event tracking (cookieless mode)

### AI

- **OpenAI** for embeddings and semantic search
- AI utilities in `src/lib/ai/` (`embeddings.ts`, `search.ts`)

### UI Component System

- **shadcn/ui** integration with Radix UI primitives
- **class-variance-authority** for component variants
- **Lucide React** for consistent iconography
- **Radix UI Slot** for composition patterns
- **clsx & tailwind-merge** for conditional styling

### Forms & Validation

- **react-hook-form** v7 with **@hookform/resolvers**
- **Zod** v4 for schema validation
- Zod schemas in `src/lib/zod-schemas/`

### Internationalization

- **Multi-language support** (en, es) with architecture ready for expansion
- **Smart locale detection** from browser settings and localStorage
- **Type-safe translations** with parameter interpolation
- **Fallback system** to English for missing translations
- Translation files structured as `src/messages/{namespace}/{locale}.json` (16 namespaces)

### Animation & UX

- **Framer Motion v12** for component animations and scroll-based effects
- **Lenis v1.0** (`@studio-freight/lenis`) for buttery smooth scrolling
- **Embla Carousel** for interactive content carousels
- **Recharts** for data visualization
- **react-grid-layout** for the widget dashboard system

### Development Infrastructure

- **Vitest v4 + React Testing Library v16.3** (unit testing)
- **Storybook v10** with accessibility addon
- **ESLint v9 + Prettier v3.8** with pre-commit hooks (Husky v9.1)
- **GitHub Actions** CI/CD pipeline

### SEO & Performance

- **Comprehensive metadata** (OpenGraph, Twitter cards, structured data)
- **Custom fonts** (next/font/local with Neue Haas Unica, Utah WGL)
- **Optimized assets** (favicons, social images, robots.txt)
- **Type-safe metadata utilities** for dynamic pages

## Directory Structure

```
src/
  app/                         # Next.js App Router
    (authenticated)/           # Protected routes (require login)
      (accounts)/account/      # Account management (profile, security, users, etc.)
      (misc)/                  # apply, contact, search, welcome, application-success
      (widgets)/               # Dashboard widget pages
      [locale]/                # Locale-prefixed authenticated pages
    (unauthenticated)/         # Pre-auth routes (accept, auth, externship-terms, incoming)
    [locale]/                  # Marketing/public pages
      (marketing)/             # Marketing route group
        page.tsx               # Homepage
        news/                  # News list & [slug] article pages
        what-we-do/
        who-we-are/
        careers/
        investors/             # With esg/ and governance/ subpages
        (contact)/             # login, signup, forgot-password, contact, support
        disclosures/
        privacy/, terms/, accessibility/
        [...rest]/             # 404 catch-all
    api/
      stripe/webhook/          # Stripe webhook handler
    globals.css
    layout.tsx                 # Root layout with providers
    providers.tsx              # Client-side provider tree
    error.tsx, not-found.tsx
    sitemap.ts, llms.txt
  components/
    common/                    # 21 subdirectories — globally reusable components
      authenticated-header/
      button/                  # Custom button with variants & themes
      carousel/
      cookie-preferences-modal/
      desktop-gate/
      disclaimer/
      form-error-message/
      header-img/
      legal-subtext/
      locale-switcher/
      news/                    # Featured carousel, latest table
      news-card/
      page-hero/
      password-checklist/
      placeholder-image/
      public-inquiry-modal/
      share-article/
      unauthenticated-header/
      utils/                   # fade-in, logout, smooth-scroll, submit-button, theme-reset
      widgets/                 # add-dropdown, macro-radar, mineral-level, widget-wrapper
      wordmark/
    ui/                        # shadcn/ui components (button, card, dialog, input, etc.)
    sanity/                    # CMS rendering components
      governance-profile/      # Portable text: body-text, image, quote
      news/                    # News: header-image, normal, thumbnail-image
      sanity-link.tsx
  context/
    theme/                     # ThemeContext with types and tests
  data/
    governance-team.json
  i18n/
    config.ts                  # Routing and locale configuration
    request.ts                 # Server-side i18n utilities
    message-files.ts           # List of all translation namespaces
  lib/
    actions/                   # Server actions (auth.ts, googleSheets.ts)
    ai/                        # AI embeddings and semantic search (OpenAI)
    db/
      schema/                  # 16 Drizzle ORM table definitions
      queries/
      types/
    hooks/                     # useCookiePreferences, useCurrentUrl, useWindowWidth
    sanity/                    # Sanity client, GROQ queries, utils
    stripe/                    # Stripe client
    supabase/                  # client.ts (browser), server.ts (server-side)
    types/                     # Shared TypeScript type definitions
    utils/                     # General utils + stripe/ subdirectory
    zod-schemas/               # auth.ts, db.ts, onboarding.ts
    auth-client.ts, auth-server.ts
    env.ts, fonts.ts, locale-utils.ts, locales.ts
    logger.ts, metadata.ts, routing.ts, utils.ts
  messages/                    # Translation files (16 namespaces × 2 locales)
    {namespace}/
      en.json
      es.json
  proxy/                       # next-intl proxy
  test/
    test-utils.tsx
  types/                       # Global TypeScript types
public/
  fonts/                       # Custom fonts (Neue Haas Unica, Utah WGL)
  publications/                # PDF documents
sanity-studio/                 # Standalone Sanity CMS Studio (separate package)
  schemaTypes/                 # news.ts, governance-profiles.ts
scripts/                       # Build and utility scripts
.github/workflows/             # CI/CD pipelines
.storybook/                    # Storybook configuration
  decorators/
components.json                # shadcn/ui configuration
```

### Development Priorities

When making changes, prioritize:

1. **Type Safety**: Maintain strict TypeScript throughout
2. **Internationalization**: Support multi-language architecture
3. **Testing**: Write tests for functionality and accessibility
4. **Performance**: Optimize animations and bundle size
5. **Accessibility**: Ensure WCAG compliance

### File Organization & Conventions

#### Component Structure

- **Slice Architecture**: Each page has its own components directory co-located with the page
- **Co-located files**: Test files (`.test.tsx`) and Storybook files (`.stories.tsx`) alongside components
- **Page-specific structure**: Components are organized per page/feature:
  ```
  app/
  ├── [locale]/
  │   ├── (marketing)/
  │   │   ├── who-we-are/
  │   │   │   ├── components/       # Page-specific components
  │   │   │   │   ├── hero/
  │   │   │   │   │   ├── types/
  │   │   │   │   │   │   └── hero.ts
  │   │   │   │   │   ├── hero.tsx
  │   │   │   │   │   ├── hero.test.tsx
  │   │   │   │   │   └── hero.stories.tsx
  │   │   │   │   └── index.ts      # Barrel export for page components
  │   │   │   └── page.tsx
  ```
- **Global components**: Reusable components in `src/components/common/` and `src/components/ui/`
- **Sanity components**: CMS rendering components in `src/components/sanity/`
- **shadcn/ui components**: Direct files in `src/components/ui/`
- **Import paths**: Use `@/` alias for all src imports
- **Naming**: Use kebab-case for directories, PascalCase for components
- **Component variants**: Use `class-variance-authority` for component styling variants

### Development Workflow

All bun commands need to be run in the `./frontend` folder

#### Commit/Push Reliability Workflow

- Before any commit or push flow that uses `--no-verify`, automatically run: `cd frontend && rm -rf .next && bun i`.
- If that command fails because of sandbox or permissions, rerun it with elevated permissions.
- If `git add`/`git commit` fails with `.git/index.lock` permission errors in sandbox, rerun the same git command with elevated permissions.
- If `git push` fails in sandbox with GitHub host/network resolution errors, rerun the push with elevated permissions.

#### Essential Commands

- `bun dev` - Development server with Turbopack
- `bun ci` - Full validation (type-check → lint → test → build)
- `bun validate` - Complete pipeline (format:check → ci)
- `bun type-check` - Check for type errors

#### Testing & Quality

- `bun run test` - Run unit tests
- `bun lint:fix` - Auto-fix linting issues
- `bun format` - Format code
- `bun storybook` - Component documentation

#### Before Making Changes

1. Run `bun validate` to ensure clean baseline
2. Create feature branch from current working branch
3. Make changes following established patterns
4. Write/update tests for new functionality
5. Run `bun validate` before committing

### Code Quality Standards

#### Pre-commit Requirements

- **Automatic formatting**: Prettier runs on staged files
- **Linting**: ESLint with auto-fix attempts
- **Type checking**: TypeScript validation before commit

#### Logging Standards

- **Environment-aware logging**: Use `@/lib/logger` instead of console methods
- **Production-safe**: Only `logger.warn` and `logger.error` should be used
- **No console.log**: Avoid console.log entirely - use logger.warn for debug info
- **Critical errors only**: Use logger.error only for critical issues that need attention

#### Pull Request Requirements

- All CI checks must pass (lint → type-check → test → build)
- New components require tests and Storybook stories
- Changes to i18n require translation updates
- Performance impact should be minimal

## Key Architecture Patterns

### When modifying database tables

Do not create migrations or migrate (i.e. no running `bunx drizzle-kit generate`).

### When Adding New Components

- **Follow slice architecture**: Page-specific components go in `app/[locale]/(marketing)/page-name/components/` (or in the appropriate route group)
- **Use TypeScript**: Strict typing for all props and state
- **Component variants**: Use `class-variance-authority` for styling variants
- **Theme support**: Integrate with existing ThemeContext when applicable
- **Internationalization**: Use next-intl for any user-facing text
- **Testing**: Include unit tests and Storybook stories
- **Performance**: Consider animation performance and bundle impact
- **shadcn/ui integration**: Leverage shadcn/ui components for consistency

### When Modifying Existing Code

- **Preserve patterns**: Follow existing component structure
- **Maintain tests**: Update tests when changing behavior
- **Check translations**: Ensure i18n keys still match
- **Verify accessibility**: Maintain ARIA attributes and semantic HTML

### State Management Approach

- **Context for global state**: Use React Context for theme, locale
- **Local state for components**: useState/useReducer for component-specific state
- **Performance optimization**: Use requestAnimationFrame for scroll/animation effects

## Development Guidelines

### Core Principles

- **Type safety first**: Use TypeScript strictly, avoid `any` types
- **Performance matters**: Optimize animations, images, and bundle size
- **Accessibility required**: Follow WCAG guidelines, test with screen readers
- **Internationalization ready**: Support multi-language from the start
- **Test-driven approach**: Write tests for new functionality
- **Properly CopyRight**: All new files should include "Copyright Todd Agriscience, Inc. All rights reserved." as a comment at the top
- **Comments**: Every exported component, page, and util should have proper jsdocs. Private helper methods, components and `.storybook.tsx` files are excluded from this principle.
- **Always format files**: Run `bun format` at the end of every piece of work

### When Making Changes

- **Understand context**: Review related files before making changes
- **Follow patterns**: Use existing component and utility patterns
- **Consider impact**: Think about performance, accessibility, and i18n
- **Document changes**: Update Storybook stories for UI changes
- **Validate thoroughly**: Run full validation suite before submitting
- **Use proper logging**: Import and use `@/lib/logger` instead of console methods

### Logging Usage Examples

```tsx
import { logger } from '@/lib/logger';

// For debugging and development info (only shows in dev/local)
logger.warn('Component state changed:', { newState });
logger.warn('[GPC] Privacy signal detected');

// For critical errors that need attention (always shows, even in production)
logger.error('API call failed:', error);
logger.error('Critical authentication error');

// console.log, console.info, console.debug can still be used for development, though they should be removed before PRs
```

### Getting Help

- **Always ask for context**: Always request clarification on requirements and questions
- **Provide options**: Present multiple implementation approaches
- **Explain tradeoffs**: Discuss pros/cons of different solutions
- **Consider maintenance**: Choose solutions that are easy to maintain
