# ToddAgriScience Website - Claude Context

## Project Overview

This is a remake of the ToddAgriScience website, migrating from the existing website structure to a more scalable and organized Next.js application with complete development infrastructure.

## Tech Stack

- Next.js 15+ (App Router with Turbopack)
- TypeScript
- Tailwind CSS
- Prismic CMS
- Jest + React Testing Library (unit tests)
- Playwright (E2E testing)
- Storybook 8 (component documentation)
- ESLint + Prettier (code quality)
- Husky + lint-staged (pre-commit hooks)
- GitHub Actions (CI/CD)
- Vercel (deployment)
- NextAuth (to be added later)
- DynamoDB (to be added later)
- Stripe integration (to be added later)

## Directory Structure

```
src/
  app/                    # Pages and API routes only
    [locale]/            # Internationalized pages
    api/                 # API routes
    globals.css          # Global styles
    layout.tsx           # Root layout
  components/             # All React components
    ui/                  # Reusable UI components
    about/               # About page specific components
    impact/              # Impact page specific components
    landing/             # Landing page components
    news/                # News related components
  context/               # React contexts
  hooks/                 # Custom hooks
  lib/                   # Utility functions
  types/                 # TypeScript type definitions
  svgs/                  # SVG components
public/                  # Static assets
  fonts/                 # Custom fonts
  publications/          # PDF documents
scripts/                 # Build and utility scripts
docs/                    # Documentation
i18n/                    # Internationalization config
slices/                  # Prismic slices
e2e/                     # End-to-end tests
.github/workflows/       # CI/CD pipelines
.storybook/             # Storybook configuration
```

## Development Progress

- [x] Initial directory structure created
- [x] Development infrastructure setup complete
  - [x] Jest + React Testing Library configured
  - [x] Playwright E2E testing setup
  - [x] Storybook 8 with a11y addon
  - [x] ESLint + Prettier configuration
  - [x] Husky pre-commit hooks
  - [x] GitHub Actions CI/CD pipeline
  - [x] All npm scripts configured
- [ ] Basic pages migration
- [ ] Component migration
- [ ] Styling setup
- [ ] Internationalization setup
- [ ] Authentication (later phase)
- [ ] Dashboard functionality (later phase)

## Key Pages to Migrate

- Home page
- About/Who we are
- What we do
- News & Events
- Contact
- Investors section
- Governance pages
- Careers
- Accessibility
- Terms & Privacy

## Migration Strategy

1. Start with base functionality and core pages
2. Maintain exact same design as original
3. Progressive enhancement approach
4. Add auth and dashboard features in later phases

## Development Guidelines

### File Organization

- **Co-located files**: Test files (`.test.tsx`) and Storybook files (`.stories.tsx`) should live alongside their components
- **Component structure**: Each component should have its own directory with:
  - `component.tsx` - Main component
  - `component.test.tsx` - Unit tests
  - `component.stories.tsx` - Storybook stories
  - `index.ts` - Barrel export
- **Import paths**: Use `@/` alias for src imports (configured in tsconfig and Jest)

### Available Scripts

- `npm run dev` - Development server with Turbopack
- `npm run build` - Production build
- `npm run test` - Run Jest unit tests
- `npm run test:watch` - Jest in watch mode
- `npm run test:coverage` - Jest with coverage report
- `npm run test:e2e` - Playwright E2E tests
- `npm run test:e2e:ui` - Playwright with UI mode
- `npm run lint` - ESLint checking
- `npm run lint:fix` - ESLint with auto-fix
- `npm run type-check` - TypeScript validation
- `npm run format` - Prettier formatting
- `npm run storybook` - Storybook development server
- `npm run build-storybook` - Build Storybook static files

### CI/CD Pipeline

- **Triggers**: Every push to any branch, PRs to dev/main
- **Workflow**: lint → type-check → unit tests → E2E tests → build
- **Deployment**:
  - Feature branches get Vercel preview deployments
  - `dev` branch deployment for staging
  - `main` branch deployment for production
- **Quality gates**: All tests must pass before deployment

### Pre-commit Hooks

- Automatically runs lint and format on staged files
- Type-checking runs on commit
- Prevents commits if linting/type errors exist

## Important Notes

- Keep the same visual design as the original website
- Focus on scalability and maintainability
- Use TypeScript throughout
- Follow Next.js App Router best practices
- Write tests alongside components (co-located)
- Use Storybook for component documentation
- All code must pass lint/type checks before commit
- Before making changes, ask questions to get full context of the user
- Before migrating & making changes, list out multiple ways to do so, from the efficient to least. If the original implementation is best, state that.
