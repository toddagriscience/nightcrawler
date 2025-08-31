# Copyright Todd LLC, All rights reserved

# Contributing to Todd Agriscience Website

Thank you for your interest in contributing! This guide will help you get started with the development workflow and project standards.

## 🚀 Quick Start for New Contributors

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Git**: Latest stable version

### First-Time Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/toddagriscience-website.git
   cd toddagriscience-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp envexample.md .env.local
   # Edit .env.local with basic development settings
   ```

4. **Verify setup**

   ```bash
   npm run validate
   ```

   This runs: format check → type check → lint → tests → build

5. **Start development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📋 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `dev` - Development branch for integration
- `feature/description` - Feature branches
- `fix/description` - Bug fix branches

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Write tests for new functionality
   - Update Storybook stories for UI changes

3. **Validate your changes**

   ```bash
   npm run validate
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

   Follow [Conventional Commits](https://conventionalcommits.org/) format

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Open a Pull Request against the `dev` branch

## 🧪 Testing Requirements

### Test Coverage

- **Unit tests**: Required for all new components and utilities
- **Storybook stories**: Required for all UI components
- **Integration tests**: Required for complex features

### Running Tests

```bash
npm run test           # Unit tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
npm run storybook      # Component testing
```

### Test Patterns

- Co-locate test files: `component.test.tsx` next to `component.tsx`
- Use React Testing Library for component tests
- Mock external dependencies
- Test accessibility with built-in a11y tools

## 🎨 Code Standards

### TypeScript

- **Strict mode enabled**: No `any` types
- **Props interfaces**: Define all component props
- **Type exports**: Export types for reusable interfaces

### Components

- **Functional components**: Use React hooks
- **Props destructuring**: Destructure props in function signature
- **Default exports**: Use default exports for components
- **Naming**: PascalCase for components, kebab-case for files

### Styling

- **Tailwind CSS**: Use Tailwind classes
- **Responsive design**: Mobile-first approach
- **Theme system**: Use existing theme context
- **Custom styles**: Avoid inline styles, use Tailwind utilities

### File Organization

```
components/
├── ui/
│   └── header/
│       ├── header.tsx
│       ├── header.test.tsx
│       ├── header.stories.tsx
│       └── index.ts
```

## 🌍 Internationalization (i18n)

### Adding New Text

1. **Add translation keys** to `src/messages/en.json` and `src/messages/es.json`
2. **Use next-intl** for all user-facing text:

   ```tsx
   import { useTranslations } from 'next-intl';

   const t = useTranslations('ComponentName');
   return <h1>{t('title')}</h1>;
   ```

### Translation Guidelines

- **Descriptive keys**: Use clear, hierarchical keys
- **Parameters**: Support dynamic content with parameters
- **Fallbacks**: Always provide English fallback

## ♿ Accessibility Requirements

### Standards

- **WCAG 2.1 AA compliance**
- **Semantic HTML**: Use appropriate HTML elements
- **ARIA labels**: Add ARIA attributes where needed
- **Keyboard navigation**: Ensure all interactions work with keyboard
- **Screen reader testing**: Test with screen readers

### Testing

- Storybook includes a11y addon for automated testing
- Manual testing with keyboard navigation
- Color contrast validation

## 📦 Component Development

### Creating New Components

1. **Create component directory**

   ```bash
   mkdir src/components/ui/my-component
   ```

2. **Component structure**

   ```tsx
   // my-component.tsx
   import { type ComponentProps } from 'react';

   interface MyComponentProps {
     title: string;
     variant?: 'primary' | 'secondary';
   }

   export default function MyComponent({
     title,
     variant = 'primary',
   }: MyComponentProps) {
     return <div className="...">{title}</div>;
   }
   ```

3. **Add tests**

   ```tsx
   // my-component.test.tsx
   import { render, screen } from '@/test/test-utils';
   import MyComponent from './my-component';

   describe('MyComponent', () => {
     it('renders title correctly', () => {
       render(<MyComponent title="Test" />);
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
   });
   ```

4. **Add Storybook story**

   ```tsx
   // my-component.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import MyComponent from './my-component';

   const meta: Meta<typeof MyComponent> = {
     title: 'UI/MyComponent',
     component: MyComponent,
   };

   export default meta;
   export const Default: StoryObj<typeof MyComponent> = {
     args: { title: 'Example' },
   };
   ```

## 🔧 Development Tools

### Essential Commands

- `npm run dev` - Development server with Turbopack
- `npm run validate` - Complete validation pipeline
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run storybook` - Component explorer

### IDE Setup

- **VS Code recommended** with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense

### Git Hooks

- **Pre-commit**: Automatic formatting and linting
- **Commit-msg**: Conventional commit format validation

## 🚫 Common Pitfalls

### Avoid These Mistakes

- **Don't use `any` types**: Always define proper TypeScript types
- **Don't skip tests**: All new components need tests
- **Don't ignore linting**: Fix ESLint warnings
- **Don't hardcode text**: Use i18n for all user-facing text
- **Don't break accessibility**: Test keyboard navigation
- **Don't commit without validation**: Always run `npm run validate`

### Performance Considerations

- **Lazy loading**: Use dynamic imports for large components
- **Image optimization**: Use Next.js Image component
- **Bundle analysis**: Check bundle size impact
- **Animation performance**: Use CSS transforms over layout changes

## 📝 Pull Request Guidelines

### PR Checklist

- [ ] Branch is up-to-date with target branch
- [ ] All tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Storybook stories updated (if UI changes)
- [ ] i18n translations added (if new text)
- [ ] Accessibility tested (if UI changes)

### PR Description

Use the provided template and include:

- Clear description of changes
- Screenshots for UI changes
- Testing notes
- Breaking changes (if any)

## 🆘 Getting Help

### Resources

- **Documentation**: Check the [README](../README.md)
- **Storybook**: Component documentation at `npm run storybook`
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions

### Contact

- **General questions**: Open a GitHub Discussion
- **Bug reports**: Use the bug report template
- **Feature requests**: Use the feature request template

## 📄 License

This project is private and proprietary to Todd Agriscience, Inc. All rights reserved.
