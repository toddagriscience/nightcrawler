# ToddAgriScience Website - Development Rules & Context

## Project Overview
A modern, production-ready Next.js website for Todd Agriscience emphasizing maintainability, type safety, internationalization support, and component-driven architecture.

## Tech Stack
- **Next.js 15** with App Router & Turbopack
- **TypeScript**, **Tailwind CSS v4**, **React 19**
- **Drizzle ORM** with PostgreSQL
- **UI Components**: shadcn/ui, class-variance-authority, Lucide React, Framer Motion v12.23, Lenis v1.0, Embla Carousel
- **Infrastructure**: Vitest v4, Storybook v9.1, ESLint v9

## Command and Execution Rules
- **Directory**: All `bun` commands MUST be run in the `./frontend` folder.
- **Commands**:
  - `bun dev` - Dev server
  - `bun ci` - Full validation
  - `bun validate` - Format check and CI
  - `bun run test` - Unit tests
  - `bun lint:fix` - Auto-fix linting
  - `bun format` - Format code

## Development & Code Quality Guidelines
1. **Type Safety**: Maintain strict TypeScript (no `any`).
2. **Internationalization**: Support multi-language architecture (en, es).
3. **Testing**: Write tests for functionality and accessibility.
4. **Performance**: Optimize animations and bundle size.
5. **Accessibility**: Ensure WCAG compliance.
6. **Copyright**: All new files should include `// Copyright Todd Agriscience, Inc. All rights reserved.` as a comment at the top.
7. **Comments**: Every exported component, page, and util should have proper JSDocs (exclude private helpers and storybook files).
8. **Logging Standards**:
   - Use `@/lib/logger` instead of console methods in production code.
   - Use `logger.error` for critical issues, `logger.warn` for debug info.
- Example:
  ```tsx
  import { logger } from '@/lib/logger';
  logger.warn('Component state changed:', { newState });
  logger.error('API call failed:', error);
  ```

## File Organization & Component Structure
- **Slice Architecture**: Page-specific components go in `app/[locale]/page-name/components/`.
- **Co-location**: Test files (`.test.tsx`) and Storybook (`.stories.tsx`) live alongside components.
- **Global components**: Reusable components in `src/components/common/` and `src/components/ui/`.
- **Naming**: `kebab-case` for directories, `PascalCase` for components.
- **Path Aliases**: Use `@/` alias for all src imports.

## State Management Approach
- React Context for global state (theme, locale).
- `useState`/`useReducer` for component-specific state.
- `requestAnimationFrame` for scroll/animation effects.
