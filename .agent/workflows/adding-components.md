---
description: When adding new React components
---

1. Determine component location: If page-specific, place in `app/[locale]/page-name/components/`. If reusable, place in `src/components/common/` or `src/components/ui/`.
2. Ensure strict TypeScript typing for all props and state.
3. Apply component styling variants using `class-variance-authority`.
4. Implement internationalization using `next-intl` for any user-facing text.
5. Create accompanied test files: Include `.test.tsx` (unit tests) and `.stories.tsx` (Storybook documentation) in the same directory.
6. Integrate with existing ThemeContext if theme support is applicable.
7. Run `bun format` inside the `frontend` directory upon completion.
