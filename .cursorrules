# ToddAgriScience Website - Development Context

## Project Overview

A modern, production-ready Next.js website for Todd Agriscience with comprehensive development infrastructure, smooth user experience, and complete SEO optimization. This codebase emphasizes maintainability, type safety, and internationalization support.

## Tech Stack

### Core Framework

- **Next.js 15** with App Router & Turbopack
- **TypeScript** with strict type checking
- **Tailwind CSS v4** with custom brand configuration
- **React 19** with modern hooks and patterns

### Internationalization

- **Multi-language support** (en, es) with architecture ready for expansion
- **Smart locale detection** from browser settings and localStorage
- **Type-safe translations** with parameter interpolation
- **Fallback system** to English for missing translations

### Animation & UX

- **Framer Motion** for component animations and scroll-based effects
- **Lenis** for buttery smooth scrolling (matching original feel)
- **Dynamic header** with scroll-based state changes
- **Advanced theme system** with smooth transitions and scroll-based dark mode
- **Centralized theme context** with debounced state management

### Development Infrastructure

- **Jest + React Testing Library** (unit testing)
- **Storybook 8** with accessibility addon
- **ESLint + Prettier** with pre-commit hooks (Husky)
- **GitHub Actions** CI/CD pipeline

### SEO & Performance

- **Comprehensive metadata** (OpenGraph, Twitter cards, structured data)
- **Custom fonts** (next/font/local with Neue Haas Unica, Utah WGL)
- **Optimized assets** (favicons, social images, robots.txt)
- **Type-safe metadata utilities** for dynamic pages

## Directory Structure

```
src/
  app/                    # Pages and API routes only
    [locale]/            # Internationalized pages (future)
    api/                 # API routes
    globals.css          # Global styles with Lenis setup
    layout.tsx           # Root layout with providers
    not-found.tsx        # Custom 404 page
  components/             # All React components
    common/              # Reusable components (Button, etc.)
    landing/             # Homepage-specific components
    ui/                  # UI components (Header, Footer, etc.)
  context/               # React contexts
    ThemeContext.tsx     # Theme and dark mode context
  lib/                   # Utility functions
    i18n/                # Internationalization config
    theme.ts             # Centralized theme system
  test/                  # Testing utilities
    test-utils.tsx       # React Testing Library setup
public/                  # Static assets
  fonts/                 # Custom fonts (Neue Haas, Utah WGL)
  publications/          # PDF documents
  images/                # Static images
scripts/                 # Build and utility scripts
.github/workflows/       # CI/CD pipelines
.storybook/             # Storybook configuration
  decorators/            # Custom Storybook decorators
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

- **Co-located files**: Test files (`.test.tsx`) and Storybook files (`.stories.tsx`) alongside components
- **Directory structure**: Each component in its own directory:
  ```
  components/ui/
  ├── header/
  ├───── header.tsx           # Main component
  ├───── header.test.tsx      # Unit tests
  ├───── header.stories.tsx   # Storybook stories
  └─ index.ts            # Barrel export for all components in the /ui directory
  ```
- **Import paths**: Use `@/` alias for all src imports
- **Naming**: Use kebab-case for directories, PascalCase for components

### Development Workflow

#### Essential Commands

- `npm run dev` - Development server with Turbopack
- `npm run ci` - Full validation (type-check → lint → test → build)
- `npm run validate` - Complete pipeline (format:check → ci)

#### Testing & Quality

- `npm run test` - Run unit tests
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code
- `npm run storybook` - Component documentation

#### Before Making Changes

1. Run `npm run validate` to ensure clean baseline
2. Create feature branch from current working branch
3. Make changes following established patterns
4. Write/update tests for new functionality
5. Run `npm run validate` before committing

### Code Quality Standards

#### Pre-commit Requirements

- **Automatic formatting**: Prettier runs on staged files
- **Linting**: ESLint with auto-fix attempts
- **Type checking**: TypeScript validation before commit

#### Pull Request Requirements

- All CI checks must pass (lint → type-check → test → build)
- New components require tests and Storybook stories
- Changes to i18n require translation updates
- Performance impact should be minimal

## Key Architecture Patterns

### When Adding New Components

- **Use TypeScript**: Strict typing for all props and state
- **Theme support**: Integrate with existing ThemeContext when applicable
- **Internationalization**: Use next-intl for any user-facing text
- **Testing**: Include unit tests and Storybook stories
- **Performance**: Consider animation performance and bundle impact

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

### When Making Changes

- **Understand context**: Review related files before making changes
- **Follow patterns**: Use existing component and utility patterns
- **Consider impact**: Think about performance, accessibility, and i18n
- **Document changes**: Update Storybook stories for UI changes
- **Validate thoroughly**: Run full validation suite before submitting
- **Properly CopyRight**: Each new file should include "Copyright Todd LLC, All rights reserved" as a comment at the top

### Getting Help

- **Always ask for context**: Always request clarification on requirements and questions
- **Provide options**: Present multiple implementation approaches
- **Explain tradeoffs**: Discuss pros/cons of different solutions
- **Consider maintenance**: Choose solutions that are easy to maintain
