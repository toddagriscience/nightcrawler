# Todd Agriscience

A modern, scalable Next.js website for Todd Agriscience with comprehensive development infrastructure and smooth user experience.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📦 Development Scripts

### Core Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Quality Assurance

- `npm run ci` - **Complete validation**: type-check → lint → test → build
- `npm run validate` - **Full pipeline**: format:check → ci
- `npm run type-check` - TypeScript type checking
- `npm run lint` - ESLint code quality check
- `npm run lint:fix` - Auto-fix ESLint issues

### Testing

- `npm test` - Run Jest unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI

### Code Formatting

- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Component Development

- `npm run storybook` - Start Storybook component explorer
- `npm run build-storybook` - Build Storybook for production

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router & Turbopack
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS v4 with custom brand configuration
- **Animations**: Framer Motion + Lenis smooth scrolling
- **Fonts**: Custom fonts (Neue Haas Unica, Utah WGL Condensed)

### Development Infrastructure

- **Testing**: Jest + React Testing Library, Playwright E2E
- **Code Quality**: ESLint + Prettier with pre-commit hooks
- **Documentation**: Storybook 8 with accessibility addon
- **CI/CD**: GitHub Actions workflow
- **Git Hooks**: Husky + lint-staged

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles & theme
│   └── layout.tsx         # Root layout with metadata
├── components/
│   └── ui/                # Reusable UI components
│       ├── header/        # Header with scroll animations
│       ├── footer/        # Footer with links
│       ├── cursor/        # Custom cursor component
│       └── index.ts       # Barrel exports
├── lib/
│   ├── fonts.ts          # Custom font configuration
│   └── metadata.ts       # SEO metadata utilities
└── svgs/                 # SVG icon components
```

## 🎨 Features

### User Experience

- **Smooth Scrolling**: Lenis-powered buttery smooth scrolling
- **Header Animations**: Dynamic header with scroll-based state changes
- **Custom Cursor**: Interactive cursor with hover effects
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: Optimized fonts, images, and animations

### SEO & Analytics

- **Comprehensive SEO**: OpenGraph, Twitter cards, structured data
- **Meta Tags**: Dynamic page-specific metadata system
- **Robots.txt**: Custom crawler rules and sitemaps
- **Favicons**: Complete icon set for all devices

### Component System

- **Co-located Tests**: Tests alongside components
- **Storybook Stories**: Interactive component documentation
- **TypeScript**: Full type safety with custom interfaces
- **Accessibility**: ARIA labels and semantic HTML

## 🧪 Testing Strategy

- **Unit Tests**: Jest + React Testing Library (18 tests passing)
- **E2E Tests**: Playwright for user journey testing
- **Component Tests**: Storybook interaction testing
- **Visual Regression**: Automated visual diff testing
- **Accessibility**: Built-in a11y testing in Storybook

## 🚀 Deployment

The site is optimized for deployment on Vercel with:

- Automatic builds on Git push
- Preview deployments for pull requests
- Edge runtime optimization
- Image optimization with Next.js

```bash
# Production build
npm run build

# Validate before deployment
npm run validate
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# Add environment variables as needed
```

### Customization

- **Colors**: Edit `src/app/globals.css` for brand colors
- **Fonts**: Modify `src/lib/fonts.ts` for typography
- **Metadata**: Update `src/lib/metadata.ts` for SEO
- **Components**: Extend `src/components/ui/` for new UI elements

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run validate` to ensure quality
4. Submit a pull request

## 📄 License

Private - Todd Agriscience, Inc.
