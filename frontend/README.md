# Todd Agriscience

A Next.js site for the Todd Agriscience's marketing site and customer platform. Please follow the base [README.md](/README.md) in the root directory for general information.

## Notes

A few important things to mention:

- "the marketing site" refers to anything under the `[locale]` route; i.e. anything that is internationalized.
- Please use the logging function from `./src/lib/logger`

## Development Scripts

### Core Commands

- `bun dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun start` - Start production server

### Quality Assurance

- `bun ci` - type-check → lint → unit tests → build
- `bun validate` - format:check → ci
- `bun type-check` - TypeScript type checking via tsc
- `bun lint` - ESLint code quality check
- `bun lint:fix` - Auto-fix ESLint issues
- `bun prelint:fix` - Adds the appropriate license header to all files

### Testing

- `bun run test` - Run Vitest unit tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Generate test coverage report

### Code Formatting

- `bun format` - Format code with Prettier
- `bun format:check` - Check code formatting

### Component Development

- `bun storybook` - Start Storybook component explorer
- `bun build-storybook` - Build Storybook for production

### Miscellaneous

- `bun run generate-icons` - Runs a script to generate PWA icons

## Tech Stack & Dependencies

As mentioned, Nightcrawler is a Next.js project. Here are a few noteworthy (and non-exhaustive) list of packages/tools that we use:

- Next.js with App Router & Turbopack
- TypeScript
- Tailwind
- ShadCN - UI library/design system
- Lucide - Icon library
- React Icons - Icon library, used specifically for brand logos
- next-intl - Internationalization for Next.js. Used only on the marketing site.
- Vitest + React Testing Library (RTL) - Testing
- Storybook - Not frequently used at the moment, but still

And a few miscellaneous packages:

- Various other UI packages: Framer Motion, Lenis, Embla Carousel, etc.
- Developer Experience (DE)/Code Quality - ESLint, Prettier, Husky, & GitHub Actions

In the same vein as UI tools, nightcrawler uses the `Neue Hass Unica` font for the majority of the site as well as `Utah WGL Condensed` for any wordmarks.

## Project Structure

Folders, what they do, and why they exist.

- `./public` - Static files. See [Next.js's documentation](https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder).
- `./coverage` - Coverage reports from Vitest. Included in `.gitignore`
- `./scripts` - Arbitrary scripts
- `./src` - Source code! Under `./src` is:
  - `/app` - Next.js's app folder
  - `/components `- Sitewide shared components
  - `/context` - Theme context logic
  - `/data` - Static data that shouldn't be publicly accessible. Rarely used
  - `/i18n` - Logic/configuration for `next-intl`
  - `/lib` - Non-UI related sitewide logic (ex. hooks)
  - `/messages` - Internationalized message files
  - `/middleware` - Middleware configuration and tests
  - `/scripts` - Arbitrary scripts. Will likely be merged with `./scripts` (scripts folder in root directory)
  - `/test` - Extra utility for testing

### Architecture (Or where do I put components?)

This ASCII chart should give you a brief overview of the architecture of nightcrawler. If possible, prefer making logic as generic as possible and placing that logic in `./src/lib`, `.src/components`, or a similar folder. Co-located components, such as `login-modal.tsx` in the diagram below, should be reserved for components that are not generic enough to be used site-wide.

Logic that isn't generic enough to be placed in one of the "generic" folders (`./src/lib`) tends to be very common -- don't panic if you feel like you're not abstracting enough.

```
.
└── src/
    ├── app/
    │   └── login/
    │       ├── page.test..tsx
    │       ├── page.tsx
    │       └── components/
    │           ├── login-modal.test.tsx
    │           └── login-modal.tsx
    ├── components/
    │   ├── ui/
    │   │   └── ...
    │   └── common/
    │       ├── button.test.tsx
    │       └── button.tsx
    ├── lib/
    │   ├── db/
    │   │   └── schema/
    │   │       ├── model.ts
    │   │       └── index.ts
    │   ├── types/
    │   │   └── auth.ts
    │   └── actions/
    │       └── auth.ts
    └── ...
```

Note that there are some older pieces of logic (namely the components for the landing page) that do not abide by this. We ask you to politely ignore this for now -- it'll be refactored in the future at some point.

## Testing Strategy

We're a startup trying to ship as fast as possible. For better or for worse, tests are not the most important thing in the world. Thus, at the bare minimum, a test should be written to ensure a certain functionality accomplishes the minimum required functionality of a page. Ex. a page file should have a test that ensures that it renders.

However, if possible, aim for 100% test coverage. The above is, again, the bare minimum requirement.

## Deployment

We're currently deploying the site on Vercel, and thus, you don't need to worry about deploying anything manually. Vercel's bot will handle preview deployments as well as production deployments. These are private by default but can have access requested.

## Configuration

### Environment Variables

You can copy environment variables from `envexample.md` into your own `.env.local` file.

### Internationalization

All internationalization is handled via `next-intl`.

If you'd like to:

- Add a new language: refer to `./src/lib/locales.ts` and `./src/lib/locale-utils.ts`, then update any necessary `next-intl` message files accordingly (see next)
- Add a new translation: refer to the `./src/messages/` folder

### Styling & Branding

We utilize multiple different UI libraries as well as Tailwind v4. Global styles are contained in `./src/app/globals.css`

## 📝 Contributing

Refer to `CONTRIBUTING.md`

## License

Private - Todd Agriscience, Inc.
